'use client';
import { motion } from "framer-motion";
import { FaChartLine } from "react-icons/fa";
import Carte from "../commons/Carte";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect } from "react";
import { fadeInUp } from "@/libs/constants";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";

const Accueil = memo(() => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const handleClick = useCallback(() => { router.push('/consulter'); }, [router]);

    useEffect(() => { if (isAuthenticated === false) { router.push('/'); } }, [isAuthenticated, router]);

    if (!isAuthenticated) { return <Loader />; }

    return (
        <motion.div className="bg-white grid md:grid-cols-1 gap-4 max-w-8xl mx-auto p-2" {...fadeInUp}>
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2, duration: 0.5 }}>
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    DATAKWABA ANALYTICS est une plateforme dédiée aux institutions en charge du tourisme en Côte d&apos;Ivoire.
                    Elle offre un accès en temps réel aux données statistiques du secteur touristique sur l&apos;ensemble du territoire national.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">Elle permet de :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-3">
                    <li>Suivre l&apos;évolution des indicateurs clés du secteur de l&apos;hôtellerie</li>
                    <li>Faciliter l&apos;analyse des tendances touristiques</li>
                    <li>Prendre des décisions stratégiques éclairées avec une visualisation claire des données</li>
                </ul>
            </motion.div>
            <Carte />
            <motion.div className="flex flex-col justify-center items-center space-y-6" {...fadeInUp} >
                <motion.button
                    onClick={handleClick}
                    className="bg-blue-800 text-white px-10 py-5 rounded-full shadow-lg text-xxs font-semibold hover:bg-green-700 transition-all duration-300 flex items-center space-x-3"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label="Consulter les données"
                >
                    <FaChartLine className="text-xxs" />
                    <span>Consulter les données</span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
});

Accueil.displayName = "Accueil";

export default Accueil;