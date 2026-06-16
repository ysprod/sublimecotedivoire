"use client";
import { memo } from "react";
import Image from "next/image";
import CacheLink from "./CacheLink";

const Bandeau = memo(function Bandeau() {
    return (
        <div className="mx-auto flex w-full max-w-8xl flex-col items-center justify-center text-center">
            <CacheLink href="/" className="w-full sm:w-auto mb-4">
                <div className="flex w-full flex-col items-center">
                    <div className="relative flex justify-center">
                        <Image
                            src="/logos.png"
                            alt="Tourisme Côte d'Ivoire"
                            width={960}
                            height={256}
                            priority
                            sizes="(max-width: 640px) 320px, (max-width: 768px) 320px, 480px"
                            className="h-auto w-[320px] object-contain sm:w-[320px] md:w-[480px]"
                        />
                    </div>

                    <div className="flex justify-center">
                        <span className="max-w-2xl text-center text-[12px] font-extrabold uppercase leading-relaxed tracking-[0.14em] text-black sm:text-xs md:text-sm">
                            Tableau de bord de Centralisation et d'analyse des Données du secteur hôtelier
                        </span>
                    </div>
                </div>
            </CacheLink>
        </div>
    );
});

export default Bandeau;