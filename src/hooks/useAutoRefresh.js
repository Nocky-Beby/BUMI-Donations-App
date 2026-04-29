import { useEffect, useRef } from "react";
import { API_BASE_URL } from "../services/api";

const EVENTS_URL = `${API_BASE_URL}/events`;

export default function useAutoRefresh(task, delay = 12000, eventTypes = []) {
  const taskRef = useRef(task);
  const eventTypesRef = useRef(eventTypes);

  useEffect(() => {
    taskRef.current = task;
  }, [task]);

  useEffect(() => {
    eventTypesRef.current = eventTypes;
  }, [eventTypes]);

  useEffect(() => {
    let cancelled = false;
    let timer = null;
    let source = null;
    let reconnectTimer = null;

    const run = async () => {
      if (cancelled) return;
      try {
        await taskRef.current?.();
      } catch {
        // La gestion d'erreur se fait dans la page qui appelle la tâche.
      }
    };

    const shouldRunForEvent = (type) => {
      const selectedTypes = eventTypesRef.current || [];
      if (!selectedTypes.length) {
        return !["connected", "ping"].includes(type);
      }
      return selectedTypes.includes(type);
    };

    const connectEvents = () => {
      if (typeof window === "undefined" || !("EventSource" in window)) return;
      source = new window.EventSource(EVENTS_URL);
      source.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (shouldRunForEvent(payload?.type)) {
            run();
          }
        } catch {
          run();
        }
      };
      source.onerror = () => {
        source?.close?.();
        source = null;
        if (!cancelled && !reconnectTimer) {
          reconnectTimer = window.setTimeout(() => {
            reconnectTimer = null;
            connectEvents();
          }, 2000);
        }
      };
    };

    const handleVisibility = () => {
      if (!document.hidden) run();
    };

    run();
    connectEvents();
    timer = window.setInterval(run, delay);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", run);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", run);
      source?.close?.();
    };
  }, [delay]);
}
