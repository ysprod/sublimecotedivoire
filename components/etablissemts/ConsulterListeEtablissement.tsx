'use client';
import { usePagination } from "@/hooks/usePagination";
import { fadeInUp } from "@/libs/constants";
import type { Etablissement } from "@/libs/interface";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { memo } from "react";
import ConsulterPageButton from "./ConsulterPageButton";
import EtabFiltreDisplay from "./EtabFiltreDisplay";
import NavButtonConsulter from "./NavButtonConsulter";

interface ConsulterListeEtablissementProps {
    etablissements: Etablissement[];
}

const ConsulterListeEtablissement = memo(({ etablissements }: ConsulterListeEtablissementProps) => {

    const { currentPage, totalPages, paginatedData, visiblePageNumbers,
        handlePageChange, goToFirstPage, goToLastPage, goToNextPage, goToPrevPage
    } = usePagination(etablissements, 5, 5);

    return (
        <motion.div className="flex flex-col items-center" {...fadeInUp}>
            <div className="mb-2 flex flex-col items-center justify-center">
                <div className="space-y-6">
                    {paginatedData.map((etab) => (
                        <EtabFiltreDisplay key={`${etab.licence}-${currentPage}`} etablissement={etab} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <motion.div
                        className="flex flex-col items-center gap-2 mt-4"
                        {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2, duration: 0.3 }}
                    >
                        <div className="flex items-center gap-1 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                            <NavButtonConsulter onClick={goToFirstPage} disabled={currentPage === 0} aria-label="Première page">
                                <ChevronsLeft className="w-5 h-5" />
                            </NavButtonConsulter>

                            <NavButtonConsulter onClick={goToPrevPage} disabled={currentPage === 0} aria-label="Page précédente">
                                <ChevronLeft className="w-5 h-5" />
                            </NavButtonConsulter>

                            <div className="flex gap-1 mx-1">
                                {visiblePageNumbers.map((page) => (
                                    <ConsulterPageButton
                                        key={page} page={page} currentPage={currentPage}
                                        onClick={() => handlePageChange(page)}
                                    />
                                ))}
                            </div>

                            <NavButtonConsulter onClick={goToNextPage} disabled={currentPage === totalPages - 1} aria-label="Page suivante">
                                <ChevronRight className="w-5 h-5" />
                            </NavButtonConsulter>

                            <NavButtonConsulter onClick={goToLastPage} disabled={currentPage === totalPages - 1} aria-label="Dernière page">
                                <ChevronsRight className="w-5 h-5" />
                            </NavButtonConsulter>
                        </div>

                        <div className="text-sm text-gray-500">
                            Page {currentPage + 1} sur {totalPages} •
                            {` ${etablissements.length} établissements au total`}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
});

ConsulterListeEtablissement.displayName = "ConsulterListeEtablissement";

export default ConsulterListeEtablissement;