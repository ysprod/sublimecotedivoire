import { CartoFiltre } from "@/libs/interface";
import { useState, useCallback, useMemo } from "react";

export interface ConsulterFiltreFormProps {
    carto: CartoFiltre;
    updateCarto: (updates: Partial<CartoFiltre>) => void;
}

export const useConsulterFiltreForm = ({ carto, updateCarto }: ConsulterFiltreFormProps) => {
    const [error, setError] = useState('');

    const validateSelection = useCallback(() => {
        if (!carto.regionId) {
            setError('Une région doit être sélectionnée');
            return false;
        }

        setError('');
        return true;
    }, [carto.regionId]);

    const handleUpdate = useCallback((field: keyof CartoFiltre) =>
        (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
            const value = e.target.value;
            const updates: Partial<CartoFiltre> = { [field]: value };

            if (field === 'regionId') {
                updates.departementId = '';
                updates.localite = '';
            } else if (field === 'departementId') {
                updates.localite = '';
            }

            updateCarto(updates);
            setError('');
        }, [updateCarto]);

    const fieldStates = useMemo(() => ({
        isDepartementDisabled: !carto.regionId,
        isCommuneDisabled: !carto.regionId,
        isFormValid: !!carto.regionId
    }), [carto.regionId]);

    return { error, validateSelection, handleUpdate, fieldStates };
};
