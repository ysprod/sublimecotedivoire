'use client';
import { memo } from "react";
import type { TabType } from "@/libs/interface";
import { COLOR_CLASSES, TAB_ETAB_CONFIG } from "@/libs/constants";

interface EtablissementsDataFiltreProps {
    handleTabChange: (tab: TabType) => void;
    activeTab: TabType;
}

const TabButtonRender = memo(({ handleTabChange, activeTab }: EtablissementsDataFiltreProps) => {

    const tabs = Object.keys(TAB_ETAB_CONFIG) as TabType[];

    return (
        <div className="flex space-x-1">
            {tabs.map((tabKey) => {
                const config = TAB_ETAB_CONFIG[tabKey];
                const isActive = activeTab === tabKey;
                const colorConfig = COLOR_CLASSES[config.color] || COLOR_CLASSES.primary;

                const buttonClasses = ['py-1 px-1 font-medium text-sm',
                    isActive
                        ? `${colorConfig.text} border-b-2 ${colorConfig.border}`
                        : 'text-gray-500 hover:text-gray-700'
                ].join(' ');

                return (
                    <button
                        key={tabKey} onClick={() => handleTabChange(tabKey)}
                        className={buttonClasses}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {config.label}
                    </button>
                );
            })}
        </div>
    );
});

TabButtonRender.displayName = "TabButtonRender";

export default TabButtonRender;