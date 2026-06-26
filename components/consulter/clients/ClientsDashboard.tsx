'use client';
import { memo } from 'react';
import Bandeau from '@/components/commons/Bandeau';
import BackButton from '@/components/commons/BackButton';
import { ReportButton } from '@/components/commons/ReportButton';
import { usePrincipale } from '@/hooks/datakwaba/clients/usePrincipale';
import { PeriodButtons } from '../commons/PeriodButtons';
import { InfoStat } from '../commons/InfoStat';
import { CategoryFilterButtons } from './CategoryFilterButtons';

const ClientsDashboard = memo(function ClientsDashboard() {
    const {
        setActivePeriod, handleBack, handleRapportClick,
        periodMultiplier, mainMenuItem, activePeriod,
    } = usePrincipale();

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center space-y-6 p-4">
            <Bandeau />
            <BackButton onClick={handleBack} />

            <PageTitle title="Statistiques des clients au plan national" />

            <PeriodButtons activePeriod={activePeriod} onPeriodChange={setActivePeriod} />

            {mainMenuItem && (
                <MainStatCard
                    item={mainMenuItem}
                    multiplier={periodMultiplier}
                    tpsglobal={0}
                />
            )}

            <CategoryFilterButtons />

            <ReportButton onClick={handleRapportClick} />
        </div>
    );
});

export default ClientsDashboard;

interface PageTitleProps {
    title: string;
}

const PageTitle = memo(function PageTitle({ title }: PageTitleProps) {
    return (
        <h1 className="text-center text-xl font-bold uppercase text-gray-800">
            {title}
        </h1>
    );
});

interface MainStatCardProps {
    item: any;
    multiplier: number;
    tpsglobal: number;
}

const MainStatCard = memo(function MainStatCard({ item, multiplier, tpsglobal }: MainStatCardProps) {
    return (
        <div className="flex w-full max-w-md justify-center">
            <InfoStat
                item={{
                    ...item,
                    nbetablissements: Math.round(item.nbetablissements * multiplier),
                }}
                inverse
                tpsglobal={tpsglobal}
            />
        </div>
    );
});