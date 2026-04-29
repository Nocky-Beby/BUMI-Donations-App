import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, storage } from "../services/api";

const AuthContext = createContext();

const DASHBOARD_BY_ROLE = {
  donor: "/espace-donateur",
  admin: "/admin",
  manager: "/responsable",
  partner: "/partenaire",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser());
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = storage.getToken();
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const response = await authApi.me();
        setUser(response.user);
        storage.setUser(response.user);
      } catch (error) {
        storage.clearToken();
        storage.clearUser();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    bootstrap();
  }, []);

  const login = async ({ email, password, role }) => {
    try {
      const response = await authApi.login({ email, password, role });
      storage.setToken(response.token);
      storage.setUser(response.user);
      setUser(response.user);

      return { success: true, redirectTo: DASHBOARD_BY_ROLE[response.user.role] };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Connexion impossible. Vérifie tes informations.",
      };
    }
  };

  const register = async ({ fullname, email, phone, password }) => {
    try {
      const response = await authApi.register({ fullname, email, phone, password });
      storage.setToken(response.token);
      storage.setUser(response.user);
      setUser(response.user);

      return { success: true, redirectTo: DASHBOARD_BY_ROLE[response.user.role] };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Inscription impossible pour le moment.",
      };
    }
  };

  const updateProfile = async (payload) => {
    try {
      const response = await authApi.updateMe(payload);
      storage.setUser(response.user);
      setUser(response.user);
      return { success: true, user: response.user, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.message || "La mise à jour du profil a échoué.",
      };
    }
  };

  const logout = () => {
    storage.clearToken();
    storage.clearUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: Boolean(user),
      isInitializing,
    }),
    [user, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
