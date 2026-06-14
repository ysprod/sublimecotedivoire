import { CURRENT_YEAR } from "@/libs/constants";
import { CartoFiltre } from "@/libs/interface";
import { useState, useMemo, useCallback } from "react";

export const useFiltreForm = (carto: CartoFiltre, updateCarto: (updates: Partial<CartoFiltre>) => void) => {
    const [error, setError] = useState('');

    const yearOptions = useMemo(() =>
        Array.from({ length: 5 }, (_, i) => ({
            value: String(CURRENT_YEAR - i),
            label: String(CURRENT_YEAR - i)
        })), []);

    const validateSelection = useCallback(() => {
        const requiredFields: Array<[string | undefined, string]> = [
            [carto.regionId, 'Une région doit être sélectionnée'],
            [carto.annee, 'Une année doit être sélectionnée'],
            [carto.mois, 'Un mois doit être sélectionné']
        ];

        const errorMessages = requiredFields.filter(([field]) => !field).map(([, message]) => message);

        if (errorMessages.length > 0) {
            setError(errorMessages.join('. '));
            return false;
        }

        setError('');
        return true;
    }, [carto.regionId, carto.annee, carto.mois]);

    const handleUpdate = useCallback((field: keyof CartoFiltre) =>
        (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
            const value = e.target.value;
            const updates: Partial<CartoFiltre> = { [field]: value };

            if (field === 'regionId') {
                updates.departementId = '';
                updates.localite = '';
            } else if (field === 'departementId') {
                updates.localite = '';
            } else if (field === 'annee') {
                updates.mois = '';
            }

            updateCarto(updates);
            setError('');
        }, [updateCarto]);

    const fieldStates = useMemo(() => ({
        isDepartementDisabled: !carto.regionId, isCommuneDisabled: !carto.regionId,
        isMonthDisabled: !carto.annee, isFormValid: !!carto.regionId && !!carto.annee && !!carto.mois
    }), [carto.regionId, carto.annee, carto.mois]);

    return { yearOptions, error, validateSelection, handleUpdate, fieldStates };
};