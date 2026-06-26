'use client';
import { memo } from 'react';
import { Calendar, Globe, Users, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FilterConfig } from '@/lib/libs/interface';

const FILTERS: FilterConfig[] = [
    {
        id: 'type',
        label: "Par Type d'établissements",
        icon: Building2,
        path: '/consulter/clients/type',
    },
    {
        id: 'genre',
        label: 'Par Genre',
        icon: Users,
        path: '/consulter/clients/genre',
    },
    {
        id: 'nationalite',
        label: 'Par Nationalité',
        icon: Globe,
        path: '/consulter/clients/nationalite',
    },
    {
        id: 'age',
        label: "Par Tranches d'âges",
        icon: Calendar,
        path: '/consulter/clients/age',
    },
] as const;

export const CategoryFilterButtons = memo(function CategoryFilterButtons() {
    const router = useRouter();
    const handleFilterClick = (path: string) => {
        router.push(path);
    };

    return (
        <div className="flex flex-wrap justify-center gap-3">
            {FILTERS.map(({ id, label, icon: Icon, path }) => (
                <button
                    key={id}
                    onClick={() => handleFilterClick(path)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    type="button"
                    aria-label={`Voir les statistiques ${label.toLowerCase()}`}
                >
                    <Icon size={18} aria-hidden="true" />
                    {label}
                </button>
            ))}
        </div>
    );
});