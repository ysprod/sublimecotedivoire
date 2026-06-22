'use client';

import { usePrincipale } from "@/hooks/datakwaba/usePrincipale";
import { TITLE_SPLIT_REGEX } from "@/lib/libs/constants";
import { getRandomCount } from "@/lib/libs/functions";
import { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
    BedDouble, Building2, Globe, Home, Hotel, MapPin, Minus, TrendingDown, TrendingUp, User,
    UserRound, Users,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

// ============ TYPES ============
interface MenuItemCardProps {
    item: MenuItem;
    onClick: (item: MenuItem) => void;
    className?: string;
    showTrend?: boolean;
}

// ============ CONSTANTES ============
const TREND_CONFIG = {
    croissance: {
        icon: TrendingUp,
        color: "text-green-600",
        bgColor: "bg-green-100"
    },
    baisse: {
        icon: TrendingDown,
        color: "text-red-600",
        bgColor: "bg-red-100"
    },
    stable: {
        icon: Minus,
        color: "text-gray-600",
        bgColor: "bg-gray-100"
    }
} as const;

const DEFAULT_TRENDS: Record<string, { value: number; direction: 'croissance' | 'baisse' | 'stable'; label: string }> = {
    'HÔTELS': { value: 5.2, direction: 'croissance', label: 'secteur en croissance' },
    'RÉSIDENCES': { value: 3.8, direction: 'croissance', label: 'demande croissante' },
    'MAISONS': { value: -2.1, direction: 'baisse', label: 'légère baisse' },
    'ÉTABLISSEMENTS': { value: 4.5, direction: 'croissance', label: 'expansion continue' },
    'CLIENTS': { value: 7.3, direction: 'croissance', label: 'hausse de fréquentation' },
    'HOMMES': { value: 2.1, direction: 'croissance', label: 'légère progression' },
    'FEMMES': { value: 8.5, direction: 'croissance', label: 'forte progression' },
    'NATIONAUX': { value: 3.2, direction: 'croissance', label: 'tourisme local' },
    'ETRANGERS': { value: 12.4, direction: 'croissance', label: 'reprise tourisme' }
};

// ============ COMPOSANTS ============

/**
 * Rendu des icônes Lucide
 */
const getIconComponent = (title: string, isBlack: boolean = false) => {
    const iconProps = {
        size: 80,
        strokeWidth: 1.5,
        className: `mb-3 w-24 h-24 ${isBlack ? 'text-gray-900' : 'text-blue-600'}`
    };

    const iconMap: Record<string, React.ReactNode> = {
        'HÔTELS': <Hotel {...iconProps} />,
        'RÉSIDENCES': <BedDouble {...iconProps} />,
        'MAISONS': <Home {...iconProps} />,
        'ÉTABLISSEMENTS': <Building2 {...iconProps} />,
        'CLIENTS': <Users {...iconProps} />,
        'HOMMES': <User {...iconProps} />,
        'FEMMES': <UserRound {...iconProps} />,
        'NATIONAUX': <MapPin {...iconProps} />,
        'ETRANGERS': <Globe {...iconProps} />,
    };

    for (const [key, icon] of Object.entries(iconMap)) {
        if (title.includes(key)) return icon;
    }

    return <Building2 {...iconProps} />;
};

/**
 * Indicateur de tendance
 */
const TrendIndicator = memo(({ trend }: { trend: { value: number; direction: 'croissance' | 'baisse' | 'stable'; label?: string } }) => {
    const config = TREND_CONFIG[trend.direction];
    const Icon = config.icon;

    return (
        <div className={clsx(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2",
            config.bgColor,
            config.color
        )}>
            <Icon size={14} />
            <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
            <span className="text-gray-600">{trend.label}</span>
        </div>
    );
});

TrendIndicator.displayName = "TrendIndicator";

/**
 * Carte d'un item du menu
 */
const MenuItemCard = memo(({
    item,
    onClick,
    className,
    showTrend = true
}: MenuItemCardProps) => {
    // Récupération de la tendance
    const trend = useMemo<{ value: number; direction: 'croissance' | 'baisse' | 'stable'; label?: string } | null>(() => {
        if (!showTrend) return null;

        // Si l'item a une tendance existante
        if (item.trend) {
            // La direction est déjà du bon type car MenuItem.trend utilise 'croissance' | 'baisse' | 'stable'
            return {
                value: item.trend.value,
                direction: item.trend.direction,
                label: item.trend.label
            };
        }

        // Générer une tendance par défaut
        const defaultTrend = DEFAULT_TRENDS[item.title?.split(' ').slice(1).join(' ') || ''];
        if (defaultTrend) {
            return defaultTrend;
        }

        // Tendance générique
        return {
            value: Math.round((Math.random() * 10 - 5) * 10) / 10,
            direction: Math.random() > 0.5 ? 'croissance' : 'baisse',
            label: 'vs période précédente'
        };
    }, [item, showTrend]);

    // Rendu du titre formaté
    const renderTitle = useCallback((title: string) => {
        const [numberPart, ...textParts] = title.split(TITLE_SPLIT_REGEX);
        const formattedNumber = parseInt(numberPart)?.toLocaleString('fr-FR') || numberPart;

        return (
            <div className="flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-blue-600">{formattedNumber}</span>
                {textParts.length > 0 && (
                    <span className="text-gray-700 text-sm font-medium mt-1">
                        {textParts.join(' ')}
                    </span>
                )}
            </div>
        );
    }, []);

    const handleClick = useCallback(() => {
        onClick(item);
    }, [item, onClick]);

    return (
        <motion.button
            onClick={handleClick}
            className={clsx(
                "p-4 flex flex-col items-center justify-center transition-all duration-300",
                "bg-white rounded-xl shadow-md hover:shadow-xl focus:outline-none",
                "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "border border-gray-100 hover:border-blue-200",
                className
            )}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Accéder à ${item.title}`}
        >
            {/* Icône */}
            <div className="relative">
                {getIconComponent(item.title!, item.blackicon?.includes('black'))}
            </div>

            {/* Titre */}
            {item.title && (
                <div className="text-center min-h-[60px] flex flex-col items-center mt-2">
                    {renderTitle(item.title)}
                </div>
            )}

            {/* Tendance */}
            {trend && <TrendIndicator trend={trend} />}

            {/* Message si pas de données */}
            {!trend && showTrend && (
                <div className="text-xs text-gray-400 mt-2">
                    Données non disponibles
                </div>
            )}
        </motion.button>
    );
});

MenuItemCard.displayName = "MenuItemCard";

// ============ HOOK DE DONNÉES ============

const createMenuItem = (
    baseTitle: string,
    count: number,
    icon: string,
    tpsglobal: number,
    blackicon: string
): MenuItem => ({
    id: baseTitle.toLowerCase().replace(/\s/g, '_'),
    title: `${count} ${baseTitle}`,
    count,
    nbetablissements: count,
    icon,
    tpsglobal,
    blackicon,
    iconSrc: icon,
    iconAlt: `Icône ${baseTitle}`,
    color: "text-black",
    bgColor: "bg-white",
    description: baseTitle,
    trendValue: 0,
});

const useMenuData = () => {
    const menuData = useMemo(() => {
        const hotelsCount = getRandomCount(2000, 10000);
        const previousHotelsCount = Math.floor(hotelsCount * (1 + (Math.random() * 0.2 - 0.1)));

        const residencesCount = Math.floor(hotelsCount * getRandomCount(30, 50) / 100);
        const previousResidencesCount = Math.floor(residencesCount * (1 + (Math.random() * 0.2 - 0.1)));

        const maisonsCount = Math.floor(hotelsCount * getRandomCount(10, 20) / 100);
        const previousMaisonsCount = Math.floor(maisonsCount * (1 + (Math.random() * 0.2 - 0.1)));

        const totalEtablissements = hotelsCount + residencesCount + maisonsCount;
        const previousTotalEtablissements = previousHotelsCount + previousResidencesCount + previousMaisonsCount;

        const hommesCount = getRandomCount(2000, 10000);
        const previousHommesCount = Math.floor(hommesCount * (1 + (Math.random() * 0.2 - 0.1)));

        const femmesCount = getRandomCount(2000, 1000);
        const previousFemmesCount = Math.floor(femmesCount * (1 + (Math.random() * 0.2 - 0.1)));

        const clientsCount = hommesCount + femmesCount;
        const previousClientsCount = previousHommesCount + previousFemmesCount;

        const nationauxRatio = getRandomCount(30, 70) / 100;
        const nationauxCount = Math.round(clientsCount * nationauxRatio);
        const previousNationauxCount = Math.round(previousClientsCount * nationauxRatio);
        const etrangersCount = clientsCount - nationauxCount;
        const previousEtrangersCount = previousClientsCount - previousNationauxCount;

        // CORRECTION: Utiliser 'croissance' | 'baisse' | 'stable' au lieu de 'up' | 'down' | 'stable'
        const getTrend = (current: number, previous: number) => {
            if (previous === 0) return { value: 0, direction: 'stable' as const, label: 'stable' };
            const variation = ((current - previous) / previous) * 100;
            return {
                value: Math.abs(Math.round(variation * 10) / 10),
                direction: variation > 0 ? 'croissance' as const : variation < 0 ? 'baisse' as const : 'stable' as const,
                label: variation > 0 ? 'en hausse' : variation < 0 ? 'en baisse' : 'stable'
            };
        };

        return {
            MAIN_MENU_ITEMS: [
                {
                    ...createMenuItem("ÉTABLISSEMENTS", totalEtablissements, "/icons/batiment.png", 0, "/icons/batiment.png"),
                    trend: getTrend(totalEtablissements, previousTotalEtablissements)
                },
                {
                    ...createMenuItem("CLIENTS", clientsCount, "/icons/clients.png", 1, "/icons/clients.png"),
                    trend: getTrend(clientsCount, previousClientsCount)
                },
                {
                    ...createMenuItem("HOMMES", hommesCount, "/icons/client.png", 2, "/icons/client.png"),
                    trend: getTrend(hommesCount, previousHommesCount)
                },
                {
                    ...createMenuItem("FEMMES", femmesCount, "/icons/cliente.png", 3, "/icons/cliente.png"),
                    trend: getTrend(femmesCount, previousFemmesCount)
                },
                {
                    ...createMenuItem("NATIONAUX", nationauxCount, "/icons/nationaux.png", 4, "/icons/nationaux.png"),
                    trend: getTrend(nationauxCount, previousNationauxCount)
                },
                {
                    ...createMenuItem("ETRANGERS", etrangersCount, "/icons/etranger.png", 5, "/icons/etranger.png"),
                    trend: getTrend(etrangersCount, previousEtrangersCount)
                }
            ]
        };
    }, []);

    return { mainmenutitems: menuData };
};

// ============ COMPOSANT PRINCIPAL ============

const Accueil = memo(() => {
    const {
        shouldShowDataNavigation,
        updateCarto,
        setshouldShowDataNavigation,
        setShowfiltreconsulter
    } = usePrincipale();

    const { mainmenutitems } = useMenuData();
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

    const handleButtonClick = useCallback((item: MenuItem) => {
        setShowfiltreconsulter(true);
        updateCarto({ tpsglobal: item.tpsglobal });
    }, [setShowfiltreconsulter, updateCarto]);

    useEffect(() => {
        if (selectedMenuItem && !shouldShowDataNavigation) {
            setshouldShowDataNavigation(true);
        }
    }, [selectedMenuItem, shouldShowDataNavigation, setshouldShowDataNavigation]);

    useEffect(() => {
        return () => {
            setSelectedMenuItem(null);
        };
    }, []);

    return (
        <div className="flex flex-col w-full max-w-3xl mx-auto p-4">
            <motion.div 
                className="grid grid-cols-1 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div 
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    initial="hidden"
                    animate="show"
                >
                    {mainmenutitems.MAIN_MENU_ITEMS.map((item: MenuItem) => (
                        <motion.div
                            key={item.tpsglobal}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0 }
                            }}
                        >
                            <MenuItemCard 
                                item={item} 
                                onClick={handleButtonClick}
                                showTrend={true}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
});

Accueil.displayName = "Accueil";

export default Accueil;