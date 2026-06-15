'use client';
import { motion } from "framer-motion";
import SelectInput from "../commons/SelectInput";
import ValidateButton from "../commons/ValidateButton";
import { memo, useCallback } from "react";
import { Input } from "antd";
import type { CartoFiltre, OptionValue } from "@/lib/libs/interface";
import { useConsulterFiltreForm } from "@/hooks/datakwaba/useConsulterFiltreForm";

interface FiltreProps {
    carto: CartoFiltre;
    regionOptions: OptionValue[];
    departementOptions: OptionValue[];
    typeEtablissement: string;
    updateCarto: (updates: Partial<CartoFiltre>) => void;
}

const FiltreForm = memo(({ regionOptions, departementOptions, typeEtablissement, carto, updateCarto, }: FiltreProps) => {

    const { error, handleUpdate, fieldStates } = useConsulterFiltreForm({ carto, updateCarto });

    const handleValidate = useCallback(() => {
        console.log('handleValidate');
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }} className="max-w-2xl mx-auto p-4"
        >
            <h3 className="text-xl font-bold mb-4 text-center">
                📊 LISTE DES {typeEtablissement.toUpperCase()}
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
                        ? "Sélectionnez d'abord une région"
                        : "Sélectionnez un département"}
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

                {error && (<motion.div className="text-red-500 text-sm p-2 bg-red-50 rounded"> {error} </motion.div>)}

                <div className="pt-4 flex justify-center">
                    <ValidateButton onClick={handleValidate} disabled={!fieldStates.isFormValid} />
                </div>
            </div>
        </motion.div>
    );
});

FiltreForm.displayName = "FiltreForm";

export default FiltreForm;