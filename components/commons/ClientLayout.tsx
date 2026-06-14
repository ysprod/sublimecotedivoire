"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UpdateNotifier() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isRegistering, setIsRegistering] = useState(true);

  const handleIgnoreUpdate = useCallback(() => setUpdateAvailable(false), []);
  const handleUpdate = useCallback(() => window.location.reload(), []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      setIsRegistering(false);
      return;
    }

    let registration: ServiceWorkerRegistration | null = null;

    const registerServiceWorker = async () => {
      try {
        registration = await navigator.serviceWorker.register("/service-worker.js");

        const handleUpdateFound = () => {
          const newWorker = registration?.installing;
          if (!newWorker) return;

          newWorker.onstatechange = () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          };
        };

        registration.onupdatefound = handleUpdateFound;
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      } finally {
        setIsRegistering(false);
      }
    };

    registerServiceWorker();

    return () => { if (registration) { registration.onupdatefound = null; } };
  }, []);

  if (isRegistering) return null;

  return (
    <AnimatePresence>
      {updateAvailable && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm"
        >
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-4">
              Nouvelle version disponible
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              Une nouvelle version de l&apos;application est disponible. Souhaitez-vous la charger maintenant ?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Mettre à jour l'application"
              >
                Mettre à jour
              </button>
              <button
                onClick={handleIgnoreUpdate}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Ignorer la mise à jour"
              >
                Plus tard
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}