import { ZoomIn } from "lucide-react";
import Image from "next/image";
import CacheLink from "../commons/CacheLink";

function CorporateMapImage() {
    return (
        <div className="mt-8 flex w-full justify-center sm:mt-10">
            <div className="relative flex justify-center">
                <div className="absolute inset-0 rounded-full bg-orange-300/20 blur-3xl" aria-hidden="true" />
                <Image
                    src="/carteverte.png"
                    alt="Carte du tourisme en Côte d'Ivoire"
                    width={260}
                    height={260}
                    priority
                    className="relative h-auto w-[240px] drop-shadow-2xl sm:w-[260px] md:w-[300px]"
                />
            </div>
        </div>
    );
}

function ActionButton() {
    return (
        <div className="text-center mb-16">
            <span className="group relative mt-6 inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-green-800 bg-[length:200%_100%] px-6 py-3 text-base font-bold text-white shadow-xl transition-all duration-300 hover:bg-[position:100%_0] hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] sm:gap-3 sm:px-8 sm:py-3.5 sm:text-lg cursor-pointer">
                <span className="relative z-10 flex items-center gap-2">
                    Consulter les données par région, département et commune
                    <ZoomIn className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
                </span>
            </span>
        </div>
    );
}

export default function Bouton() {

    return (
        <div className="mx-auto max-w-4xl p-2">
            <CacheLink href="/recherche" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-2xl">
                <CorporateMapImage />
                <ActionButton />
            </CacheLink>
        </div>
    );
}