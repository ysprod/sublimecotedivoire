'use client';
import { memo } from "react";
import { CartoFiltre, DataStatistique, OptionValue } from "@/libs/interface";
import FiltreForm from "./FiltreForm";
import CarteStat from "../map/CarteStat";

interface FiltreProps {
    carto: CartoFiltre;
    regionOptions: OptionValue[];
    departementOptions: OptionValue[];
    regions: DataStatistique[];
    updateCarto: (updates: Partial<CartoFiltre>) => void;
    setShowResults: (show: boolean) => void;
}

const RechercheFiltreHome = memo(({ carto, regions, departementOptions, regionOptions, updateCarto, setShowResults, }: FiltreProps) => {

    return (<>
        <FiltreForm regionOptions={regionOptions} setShowResults={setShowResults}
            departementOptions={departementOptions} carto={carto} updateCarto={updateCarto}
        />
        <CarteStat data={regions} />
    </>);
});

RechercheFiltreHome.displayName = 'RechercheFiltreHome';

export default RechercheFiltreHome;