'use client';
import { motion } from "framer-motion";
import SelectInput from "../commons/SelectInput";
import ValidateButton from "../commons/ValidateButton";
import { memo, useCallback } from "react";
import { Input } from "antd";
import { MONTHS } from "@/libs/constants";
import type { CartoFiltre, OptionValue } from "@/libs/interface";
import { useFiltreForm } from "@/hooks/useFiltreForm";

interface FiltreProps {
    carto: CartoFiltre;
    regionOptions: OptionValue[];
    departementOptions: OptionValue[];
    setShowResults: (show: boolean) => void;
    updateCarto: (updates: Partial<CartoFiltre>) => void;
}

const FiltreForm = memo(({ regionOptions, departementOptions, carto, setShowResults, updateCarto }: FiltreProps) => {

    const { yearOptions, error, validateSelection, handleUpdate, fieldStates } = useFiltreForm(carto, updateCarto);

    const handleValidate = useCallback(() => {
        if (validateSelection()) { setShowResults(true); }
    }, [validateSelection, setShowResults]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }} className="max-w-2xl mx-auto p-6"
        >
            <h3 className="text-xxs font-bold mb-6 text-center text-gray-800 uppercase">
                📊 Consultation des données par région
            </h3>

            <div className="space-y-4">
                <SelectInput
                    label="Région / District Autonome"
                    value={carto.regionId || ''}
                    onChange={handleUpdate('regionId')}
                    options={regionOptions}
                    placeholder="Sélectionnez une région"
                />
                <SelectInput
                    label="Département"
                    value={carto.departementId || ''}
                    onChange={handleUpdate('departementId')}
                    disabled={fieldStates.isDepartementDisabled}
                    options={departementOptions}
                    placeholder={fieldStates.isDepartementDisabled
                        ? "Sélectionnez d'abord une région" : "Sélectionnez un département"}
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium">Localité/Commune</label>
                    <Input
                        value={carto.localite || ''}
                        onChange={handleUpdate('localite')}
                        disabled={fieldStates.isCommuneDisabled}
                        placeholder="Localité/Commune"
                        className="w-full"
                    />
                </div>

                <p className="text-xl font-semibold text-gray-800 text-center mt-4 border-t pt-4">Définissez la période pour laquelle vous souhaitez afficher les données</p>

                <SelectInput
                    label="Année"
                    value={carto.annee || ''}
                    onChange={handleUpdate('annee')}
                    options={yearOptions}
                    placeholder="Sélectionnez une année"
                />
                <SelectInput
                    label="Mois"
                    value={carto.mois || ''}
                    onChange={handleUpdate('mois')}
                    options={MONTHS}
                    placeholder="Sélectionnez un mois"
                    disabled={fieldStates.isMonthDisabled}
                />

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-red-500 text-sm p-2 bg-red-50 rounded"
                    >
                        {error}
                    </motion.div>
                )}
                <div className="pt-4 flex justify-center">
                    <ValidateButton onClick={handleValidate} disabled={!fieldStates.isFormValid} />
                </div>
            </div>
        </motion.div>
    );
});

FiltreForm.displayName = "FiltreForm";

export default FiltreForm;