"use client";
import { motion } from "framer-motion";
import { memo, useCallback, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fadeInUp } from "@/libs/constants";

const Carte: React.FC = memo(() => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = useCallback(() => {
        setIsClicked(true);
        router.push('/recherche');
    }, [router]);

    return (
        <motion.div className="bg-white flex flex-col items-center justify-center" {...fadeInUp}>

            <motion.div className="max-w-6xl w-full" {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>

                <motion.div
                    className="relative flex flex-col items-center justify-center overflow-hidden cursor-pointer group"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: isClicked ? 0.95 : isHovered ? 1.02 : 1 }}
                    transition={{ duration: 0.3 }} whileHover={{ scale: 1.02 }} onClick={handleClick}
                    onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
                >
                    <Image
                        src={isHovered ? "/CarteDatasurvol.png" : "/CarteData.png"} width={800} height={450}
                        alt="Carte des régions de Côte d'Ivoire - Cliquez pour accéder à la recherche"
                        className="object-cover w-full h-full transition-all duration-300" priority
                    />
                </motion.div>

                {isHovered && (
                    <div className="flex items-center justify-center text-center mt-4">
                        Consulter les données par régions, départements ou communes
                    </div>
                )}

            </motion.div>

        </motion.div>
    );
});

Carte.displayName = "Carte";

export default Carte;