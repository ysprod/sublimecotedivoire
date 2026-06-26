import ClientsDashboard from '@/components/consulter/clients/ClientsDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Statistiques des Clients - DATAKWABA',
    description: 'Consultez les statistiques détaillées des clients au plan national',
};

export default function Page() {
    return <ClientsDashboard />;
}