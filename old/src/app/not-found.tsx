'use client';
import ErrorFallback from "@/components/commons/ErrorFallback";
import { fadeInUp } from "@/libs/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

const NotFound = () => {

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AnimatePresence>
        <motion.div key="not-found-page" aria-label="Page non trouvée"
          {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }} exit={{ opacity: 0, y: -10 }}
          className="w-full flex flex-col justify-center items-center p-4"
        >
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8 sm:p-10 text-center w-full max-w-lg mx-auto">

            <h1 className="text-2xl font-extrabold text-gray-900 mb-6 uppercase">
              404 - Page non trouvée
            </h1>

            <p className="text-lg text-gray-700 mb-6">
              Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
            </p>

            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
            >
              Retour à l&apos;accueil
            </motion.a>

          </div>
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default NotFound;