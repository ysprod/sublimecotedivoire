'use client';

import { Etablissement } from "@/libs/interface";
import TypeIcon from "./TypeIcon";
import { memo } from "react";

const EtablissementHeader = memo(({ etablissement }: { etablissement: Etablissement }) => (
    <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
            <TypeIcon type={etablissement.type} />
            <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{etablissement.nom}</h3>

                <h3 className="text-lg font-bold text-gray-800">
                    {etablissement.classification && (
                        <span className="ml-2 text-yellow-500">
                            {'★'.repeat(parseInt(etablissement.classification))}
                        </span>
                    )}
                </h3>

                <p className="text-sm text-gray-500 mt-1">{etablissement.type}</p>
            </div>
        </div>
    </div>
));

EtablissementHeader.displayName = 'EtablissementHeader';

export default EtablissementHeader;