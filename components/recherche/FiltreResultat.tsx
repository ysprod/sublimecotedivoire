'use client';
import { memo, useCallback, useState } from "react";
import type { CartoFiltre, DataStatistique, MenuItem, OptionValue } from "@/libs/interface";
import MenuDiambraFiltre from "./MenuDiambraFiltre";
import RechercheFiltreHome from "./RechercheFiltreHome";

interface FiltreProps {
    carto: CartoFiltre;
    regionOptions: OptionValue[];
    departementOptions: OptionValue[];
    regions: DataStatistique[];
    mainmenutitems: MenuItem[];
    setShowfiltreconsulter: (value: boolean) => void;
    updateCarto: (updates: Partial<CartoFiltre>) => void;
}

const FiltreResultat = memo(({ regions, mainmenutitems, carto, departementOptions,
    regionOptions, updateCarto, setShowfiltreconsulter }: FiltreProps) => {
    const [showResults, setShowResults] = useState(false);

    const handleBack = useCallback(() => setShowResults(false), [setShowResults]);
    return (
        <>
            {showResults ? (<MenuDiambraFiltre
                onBack={handleBack} mainmenutitems={mainmenutitems}
                carto={carto} updateCarto={updateCarto}
                setShowfiltreconsulter={setShowfiltreconsulter}
            />) : (
                <RechercheFiltreHome
                    regionOptions={regionOptions} setShowResults={setShowResults}
                    departementOptions={departementOptions} carto={carto}
                    updateCarto={updateCarto} regions={regions}
                />)}
        </>)

});

FiltreResultat.displayName = 'FiltreResultat';

export default FiltreResultat;