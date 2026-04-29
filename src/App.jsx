import { Route, Routes } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Needs from "./pages/public/Needs";
import DonateGuide from "./pages/public/DonateGuide";
import Impact from "./pages/public/Impact";
import Contact from "./pages/public/Contact";
import FAQ from "./pages/public/FAQ";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import NotFound from "./pages/NotFound";

import DonorDashboard from "./pages/donor/DonorDashboard";
import MakeDonation from "./pages/donor/MakeDonation";
import DonationHistory from "./pages/donor/DonationHistory";
import DonationTracking from "./pages/donor/DonationTracking";
import DonorProfile from "./pages/donor/DonorProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import DonorsManagement from "./pages/admin/DonorsManagement";
import DonationsManagement from "./pages/admin/DonationsManagement";
import NeedsManagement from "./pages/admin/NeedsManagement";
import PartnersManagement from "./pages/admin/PartnersManagement";
import DistributionsManagement from "./pages/admin/DistributionsManagement";
import ReportsPage from "./pages/admin/ReportsPage";
import AdminSettings from "./pages/admin/AdminSettings";

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import UpdateNeeds from "./pages/manager/UpdateNeeds";
import ReceivedDonations from "./pages/manager/ReceivedDonations";
import ManagerDistributionTracking from "./pages/manager/ManagerDistributionTracking";
import ManagerReports from "./pages/manager/ManagerReports";

import PartnerDashboard from "./pages/partner/PartnerDashboard";
import PartnerNeeds from "./pages/partner/PartnerNeeds";
import PartnerContributions from "./pages/partner/PartnerContributions";
import PartnerImpact from "./pages/partner/PartnerImpact";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/besoins" element={<Needs />} />
        <Route path="/comment-faire-un-don" element={<DonateGuide />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["donor", "admin", "manager", "partner"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/espace-donateur" element={<DonorDashboard />} />
          <Route path="/espace-donateur/faire-un-don" element={<MakeDonation />} />
          <Route path="/espace-donateur/historique" element={<DonationHistory />} />
          <Route path="/espace-donateur/suivi" element={<DonationTracking />} />
          <Route path="/espace-donateur/profil" element={<DonorProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/donateurs" element={<DonorsManagement />} />
          <Route path="/admin/dons" element={<DonationsManagement />} />
          <Route path="/admin/besoins" element={<NeedsManagement />} />
          <Route path="/admin/partenaires" element={<PartnersManagement />} />
          <Route path="/admin/distributions" element={<DistributionsManagement />} />
          <Route path="/admin/rapports" element={<ReportsPage />} />
          <Route path="/admin/parametres" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/responsable" element={<ManagerDashboard />} />
          <Route path="/responsable/besoins" element={<UpdateNeeds />} />
          <Route path="/responsable/dons" element={<ReceivedDonations />} />
          <Route path="/responsable/distributions" element={<ManagerDistributionTracking />} />
          <Route path="/responsable/rapports" element={<ManagerReports />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["partner"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/partenaire" element={<PartnerDashboard />} />
          <Route path="/partenaire/besoins" element={<PartnerNeeds />} />
          <Route path="/partenaire/contributions" element={<PartnerContributions />} />
          <Route path="/partenaire/impact" element={<PartnerImpact />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
