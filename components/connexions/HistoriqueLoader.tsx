'use client';
import { memo } from 'react';
import Loader from '../commons/Loader';
import { DATA_LOADING } from '@/libs/constants';

interface HistoriqueLoaderProps {
    texte?: string;
}

const HistoriqueLoader = memo(({ texte = DATA_LOADING }: HistoriqueLoaderProps) => {

    return (
        <div className="p-2 max-w-7xl mx-auto flex flex-col justify-center items-center">

            <div className="text-lg mb-2 uppercase font-semibold text-center uppercase">
                {texte}
            </div>

            <Loader />
        </div>
    );
});

HistoriqueLoader.displayName = "HistoriqueLoader";

export default HistoriqueLoader;