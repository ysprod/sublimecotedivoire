'use client';

import Charte from "@/components/charts/Charte";
import BackButton from "@/components/commons/BackButton";
import Bandeau from "@/components/commons/Bandeau";
import { usePrincipale } from "@/hooks/datakwaba/hotels/usePrincipale";
import clsx from "clsx";
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Bed,
  Building2,
  Calendar,
  Crown,
  FileText,
  Heart,
  Home,
  Hotel,
  LineChart,
  Minus,
  Star,
  Target,
  TrendingUp,
  Users,
  Wifi
} from 'lucide-react';
import { memo, useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { PeriodButtons } from "../../commons/PeriodButtons";
import PDFDownloadButton from "./ReportPDF";

const GRADIENT_START = '#667eea';
const GRADIENT_END = '#764ba2';

// Configuration des couleurs pour les cartes KPI
const CARD_COLORS = {
  blue: { border: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
  green: { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
  orange: { border: 'border-orange-500', bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
  indigo: { border: 'border-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-600', gradient: 'from-indigo-500 to-indigo-600' },
  rose: { border: 'border-rose-500', bg: 'bg-rose-100', text: 'text-rose-600', gradient: 'from-rose-500 to-rose-600' },
  cyan: { border: 'border-cyan-500', bg: 'bg-cyan-100', text: 'text-cyan-600', gradient: 'from-cyan-500 to-cyan-600' },
  amber: { border: 'border-amber-500', bg: 'bg-amber-100', text: 'text-amber-600', gradient: 'from-amber-500 to-amber-600' },
};

// Configuration des types d'établissements

// Données du rapport analytique - STATIQUES
const RAPPORT_DATA = {
  totalEtablissements: 10000,
  parType: {
    hotels: 4500,
    residences: 3000,
    maisons: 2500
  },
  activite: {
    actifs: 7800,
    inactifs: 2200
  },
  parEtoiles: {
    '1★': 500,
    '2★': 1500,
    '3★': 3500,
    '4★': 3000,
    '5★': 1500
  },
  equipements: {
    wifi: 8500,
    parking: 7000,
    restaurant: 6000,
    piscine: 4500,
    spa: 2500
  },
  satisfaction: {
    excellent: 4500,
    bon: 3000,
    moyen: 1500,
    insuffisant: 1000
  },
  performance: {
    croissance: 12.5,
    satisfaction: 92,
    retention: 82,
    acquisition: 18,
    occupation: 78,
    conversion: 15,
    nps: 65,
    churn: 8
  },
  evolutionMensuelle: [
    { mois: 'Jan', valeur: 8500, pourcentage: 85 },
    { mois: 'Fév', valeur: 8800, pourcentage: 88 },
    { mois: 'Mar', valeur: 9200, pourcentage: 92 },
    { mois: 'Avr', valeur: 8900, pourcentage: 89 },
    { mois: 'Mai', valeur: 9300, pourcentage: 93 },
    { mois: 'Jun', valeur: 9600, pourcentage: 96 },
    { mois: 'Jul', valeur: 9400, pourcentage: 94 },
    { mois: 'Aoû', valeur: 9700, pourcentage: 97 },
    { mois: 'Sep', valeur: 9500, pourcentage: 95 },
    { mois: 'Oct', valeur: 9800, pourcentage: 98 },
    { mois: 'Nov', valeur: 10000, pourcentage: 100 },
    { mois: 'Déc', valeur: 10500, pourcentage: 105 }
  ],
  topRegions: [
    { rang: 1, region: 'Dakar', total: 2500, croissance: 15.2, saturation: 82 },
    { rang: 2, region: 'Thiès', total: 1200, croissance: 14.8, saturation: 65 },
    { rang: 3, region: 'Saint-Louis', total: 950, croissance: 13.5, saturation: 58 },
    { rang: 4, region: 'Ziguinchor', total: 850, croissance: 12.1, saturation: 45 },
    { rang: 5, region: 'Touba', total: 750, croissance: 11.8, saturation: 42 },
    { rang: 6, region: 'Kaolack', total: 680, croissance: 10.5, saturation: 38 },
    { rang: 7, region: 'Tambacounda', total: 520, croissance: 9.8, saturation: 35 },
    { rang: 8, region: 'Kolda', total: 450, croissance: 9.2, saturation: 30 },
    { rang: 9, region: 'Kédougou', total: 380, croissance: 8.7, saturation: 28 },
    { rang: 10, region: 'Sédhiou', total: 300, croissance: 8.1, saturation: 25 }
  ]
};

const MenuDiambra = memo(() => {
  const {
    handleBack,
    adaptedIndicators,
    activePeriod,
    setActivePeriod
  } = usePrincipale();

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'types' | 'equipements' | 'satisfaction' | 'regions'>('overview');

  // Utilisation des données du rapport
  const stats = useMemo(() => {
    const totalEtablissements = RAPPORT_DATA.totalEtablissements;

    // Statistiques par type
    const typeStats = [
      {
        name: 'Hôtels',
        value: RAPPORT_DATA.parType.hotels,
        percentage: (RAPPORT_DATA.parType.hotels / totalEtablissements) * 100,
        color: '#0088FE',
        icon: Hotel,
        id: 'HÔTELS',
        bg: 'bg-blue-50',
        emoji: '🏨',
        description: 'Établissements hôteliers'
      },
      {
        name: 'Résidences',
        value: RAPPORT_DATA.parType.residences,
        percentage: (RAPPORT_DATA.parType.residences / totalEtablissements) * 100,
        color: '#00C49F',
        icon: Home,
        id: 'RÉSIDENCES',
        bg: 'bg-green-50',
        emoji: '🏡',
        description: 'Résidences touristiques'
      },
      {
        name: "Maisons d'Hôtes",
        value: RAPPORT_DATA.parType.maisons,
        percentage: (RAPPORT_DATA.parType.maisons / totalEtablissements) * 100,
        color: '#FFBB28',
        icon: Bed,
        id: 'MAISONS',
        bg: 'bg-yellow-50',
        emoji: '🛏️',
        description: 'Maisons d\'hôtes'
      }
    ];

    // Données pour le radar
    const radarData = [
      { subject: 'Hôtels', A: (RAPPORT_DATA.parType.hotels / totalEtablissements) * 100, fullMark: 100 },
      { subject: 'Résidences', A: (RAPPORT_DATA.parType.residences / totalEtablissements) * 100, fullMark: 100 },
      { subject: 'Maisons', A: (RAPPORT_DATA.parType.maisons / totalEtablissements) * 100, fullMark: 100 },
      { subject: 'Occupation', A: (RAPPORT_DATA.activite.actifs / totalEtablissements) * 100, fullMark: 100 },
      { subject: 'Satisfaction', A: RAPPORT_DATA.performance.satisfaction, fullMark: 100 },
      { subject: 'Équipements', A: Object.values(RAPPORT_DATA.equipements).reduce((a, b) => a + b, 0) / (Object.values(RAPPORT_DATA.equipements).length * totalEtablissements) * 100, fullMark: 100 }
    ];

    return {
      totalEtablissements,
      typeStats,
      detailedStats: RAPPORT_DATA,
      radarData,
      evolutionData: RAPPORT_DATA.evolutionMensuelle,
      performance: RAPPORT_DATA.performance,
      tauxCroissance: RAPPORT_DATA.performance.croissance,
      isCroissant: RAPPORT_DATA.performance.croissance > 0,
      topRegions: RAPPORT_DATA.topRegions
    };
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-2xl transform transition-all duration-200 scale-100">
          <p className="font-bold text-gray-700 border-b pb-2 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm flex items-center gap-2 py-1" style={{ color: entry.color }}>
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: <strong>{entry.value.toLocaleString()}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  // Configuration des cartes KPI
  const kpiCards = [
    {
      id: 'total',
      title: 'Total Établissements',
      value: stats.totalEtablissements.toLocaleString(),
      icon: Building2,
      color: CARD_COLORS.blue,
      trend: stats.performance.croissance,
      subtitle: 'vs période précédente',
      detail: `+${stats.performance.acquisition}% d'acquisition`
    },
    {
      id: 'occupation',
      title: "Taux d'Activité",
      value: `${Math.round((stats.detailedStats.activite.actifs / stats.totalEtablissements) * 100)}%`,
      icon: Users,
      color: CARD_COLORS.green,
      trend: 3.2,
      subtitle: "taux d'activité",
      detail: `${stats.detailedStats.activite.actifs.toLocaleString()} actifs`
    },
    {
      id: 'satisfaction',
      title: 'Satisfaction Globale',
      value: `${Math.round(stats.performance.satisfaction)}%`,
      icon: Award,
      color: CARD_COLORS.purple,
      trend: 5.2,
      subtitle: 'score de satisfaction',
      detail: `${Math.round(stats.performance.nps)} NPS`
    },
    {
      id: 'etoiles',
      title: 'Établissements 4★ & 5★',
      value: `${Math.round((stats.detailedStats.parEtoiles['4★'] + stats.detailedStats.parEtoiles['5★']) / stats.totalEtablissements * 100)}%`,
      icon: Star,
      color: CARD_COLORS.amber,
      trend: 6.8,
      subtitle: 'haut de gamme',
      detail: `${(stats.detailedStats.parEtoiles['4★'] + stats.detailedStats.parEtoiles['5★']).toLocaleString()} établissements`
    }
  ];

  // Onglets de navigation
  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LineChart },
    { id: 'types', label: 'Types', icon: Building2 },
    { id: 'equipements', label: 'Équipements', icon: Wifi },
    { id: 'satisfaction', label: 'Satisfaction', icon: Award },
    { id: 'regions', label: 'Régions', icon: Target }
  ] as const;

  // Composant pour afficher la jauge
  const SatisfactionGauge = ({ value, label, color }: { value: number; label: string; color: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white/80 backdrop-blur-sm flex flex-col items-center w-full max-w-8xl mx-auto p-6 space-y-8 shadow-xl">
        <Bandeau />

        <div className="w-full flex justify-between items-center">
          <BackButton onClick={handleBack} />
          <PDFDownloadButton
            mainItem={adaptedIndicators?.mainItem || null}
            hotelItems={adaptedIndicators?.subItems || []}
            subItems={adaptedIndicators?.subItems || []}
          />
        </div>

        {/* En-tête institutionnel */}
        <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-300" />
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  Rapport Établissements Hôteliers
                </h1>
              </div>
              <p className="text-blue-100 mt-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Analyse complète du parc hôtelier national
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-blue-200 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {stats.totalEtablissements.toLocaleString()} établissements analysés
                </span>
                {stats.isCroissant && (
                  <span className="flex items-center gap-1 bg-green-500/30 px-3 py-1 rounded-full text-green-200">
                    <TrendingUp className="w-4 h-4" />
                    +{stats.tauxCroissance}% croissance
                  </span>
                )}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30">
              <span className="text-sm font-medium text-blue-100">Période d'analyse</span>
              <PeriodButtons
                activePeriod={activePeriod}
                onPeriodChange={setActivePeriod}
              />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card) => (
            <div
              key={card.id}
              className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 ${card.color.border} hover:scale-105 cursor-pointer`}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                </div>
                <div className={`${card.color.bg} p-3 rounded-full transform transition-all duration-300 ${hoveredCard === card.id ? 'scale-110 rotate-12' : ''}`}>
                  <card.icon className={`w-6 h-6 ${card.color.text}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                {getTrendIcon(card.trend)}
                <span className={`font-medium ${getTrendColor(card.trend)}`}>
                  {card.trend > 0 ? '+' : ''}{card.trend}%
                </span>
                <span className="text-gray-400 ml-2">{card.subtitle}</span>
              </div>
              <div className="mt-1 text-xs text-gray-400">
                {card.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Onglets de navigation */}
        <div className="w-full bg-white rounded-xl p-2 shadow-lg flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Contenu des onglets */}
        <div className="w-full">
          {/* Vue d'ensemble */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Graphique d'évolution */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-blue-600" />
                    Évolution des Établissements (2024)
                  </h2>
                  <span className="text-sm text-green-600 font-medium">+12.5% de croissance</span>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={stats.evolutionData}>
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={GRADIENT_START} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={GRADIENT_END} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mois" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="valeur"
                        stroke={GRADIENT_START}
                        fill="url(#colorGradient)"
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="valeur"
                        stroke="#667eea"
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#667eea' }}
                      />
                      <Scatter
                        yAxisId="right"
                        dataKey="pourcentage"
                        fill="#764ba2"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Statistiques rapides */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Hotel className="w-5 h-5" />
                    <span className="font-semibold">Hôtels</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {stats.detailedStats.parType.hotels.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">45% du total</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 text-green-600">
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">Résidences</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {stats.detailedStats.parType.residences.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">30% du total</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-100">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Bed className="w-5 h-5" />
                    <span className="font-semibold">Maisons</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {stats.detailedStats.parType.maisons.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">25% du total</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Star className="w-5 h-5" />
                    <span className="font-semibold">Moyenne Étoiles</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {((stats.detailedStats.parEtoiles['1★'] * 1 +
                      stats.detailedStats.parEtoiles['2★'] * 2 +
                      stats.detailedStats.parEtoiles['3★'] * 3 +
                      stats.detailedStats.parEtoiles['4★'] * 4 +
                      stats.detailedStats.parEtoiles['5★'] * 5) / stats.totalEtablissements).toFixed(1)} ★
                  </p>
                  <p className="text-xs text-gray-500">note moyenne</p>
                </div>
              </div>
            </div>
          )}

          {/* Types */}
          {activeTab === 'types' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition par type */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Répartition par Type
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.typeStats.map(s => ({ name: s.name, value: s.value, color: s.color }))}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(1)}%`}
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                      >
                        {stats.typeStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {stats.typeStats.map((type) => (
                    <div key={type.id} className={`${type.bg} rounded-lg p-2`}>
                      <span className="text-2xl">{type.emoji}</span>
                      <p className="text-xs font-bold text-gray-700">{type.name}</p>
                      <p className="text-sm font-bold text-gray-900">{type.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Répartition par étoiles */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Répartition par Étoiles
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(stats.detailedStats.parEtoiles).map(([stars, value]) => ({
                      stars,
                      value
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stars" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                        <Cell fill="#FFD700" />
                        <Cell fill="#C0C0C0" />
                        <Cell fill="#CD7F32" />
                        <Cell fill="#0088FE" />
                        <Cell fill="#FF6B6B" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-600">
                  <span>1★: {stats.detailedStats.parEtoiles['1★']}</span>
                  <span>2★: {stats.detailedStats.parEtoiles['2★']}</span>
                  <span>3★: {stats.detailedStats.parEtoiles['3★']}</span>
                  <span>4★: {stats.detailedStats.parEtoiles['4★']}</span>
                  <span>5★: {stats.detailedStats.parEtoiles['5★']}</span>
                </div>
              </div>
            </div>
          )}

          {/* Équipements */}
          {activeTab === 'equipements' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Wifi className="w-5 h-5 text-blue-600" />
                  Taux d'Équipement
                </h3>
                <div className="space-y-4">
                  <SatisfactionGauge
                    value={Math.round((stats.detailedStats.equipements.wifi / stats.totalEtablissements) * 100)}
                    label="Wi-Fi"
                    color="#0088FE"
                  />
                  <SatisfactionGauge
                    value={Math.round((stats.detailedStats.equipements.parking / stats.totalEtablissements) * 100)}
                    label="Parking"
                    color="#00C49F"
                  />
                  <SatisfactionGauge
                    value={Math.round((stats.detailedStats.equipements.restaurant / stats.totalEtablissements) * 100)}
                    label="Restaurant"
                    color="#FFBB28"
                  />
                  <SatisfactionGauge
                    value={Math.round((stats.detailedStats.equipements.piscine / stats.totalEtablissements) * 100)}
                    label="Piscine"
                    color="#FF8042"
                  />
                  <SatisfactionGauge
                    value={Math.round((stats.detailedStats.equipements.spa / stats.totalEtablissements) * 100)}
                    label="Spa"
                    color="#8884D8"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Radar des Indicateurs
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={stats.radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis />
                      <Radar
                        name="Indicateurs"
                        dataKey="A"
                        stroke="#667eea"
                        fill="#667eea"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Satisfaction */}
          {activeTab === 'satisfaction' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Niveau de Satisfaction
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Excellent', value: stats.detailedStats.satisfaction.excellent, color: '#22c55e' },
                          { name: 'Bon', value: stats.detailedStats.satisfaction.bon, color: '#3b82f6' },
                          { name: 'Moyen', value: stats.detailedStats.satisfaction.moyen, color: '#f59e0b' },
                          { name: 'Insuffisant', value: stats.detailedStats.satisfaction.insuffisant, color: '#ef4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(1)}%`}
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                      >
                        <Cell fill="#22c55e" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
                  <div><span className="text-green-500">●</span> {stats.detailedStats.satisfaction.excellent}</div>
                  <div><span className="text-blue-500">●</span> {stats.detailedStats.satisfaction.bon}</div>
                  <div><span className="text-yellow-500">●</span> {stats.detailedStats.satisfaction.moyen}</div>
                  <div><span className="text-red-500">●</span> {stats.detailedStats.satisfaction.insuffisant}</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-red-500" />
                  Indicateurs de Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Satisfaction Globale</span>
                      <span className="font-bold text-gray-800">{Math.round(stats.performance.satisfaction)}%</span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" style={{ width: `${stats.performance.satisfaction}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">NPS (Net Promoter Score)</span>
                      <span className="font-bold text-gray-800">{Math.round(stats.performance.nps)}</span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" style={{ width: `${(stats.performance.nps / 100) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taux de Rétention</span>
                      <span className="font-bold text-gray-800">{Math.round(stats.performance.retention)}%</span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" style={{ width: `${stats.performance.retention}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taux de Churn</span>
                      <span className="font-bold text-gray-800">{Math.round(stats.performance.churn)}%</span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full" style={{ width: `${stats.performance.churn}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Régions */}
          {activeTab === 'regions' && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-indigo-600" />
                Top 10 Régions les Plus Équipées
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Rang</th>
                      <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Région</th>
                      <th className="text-right py-2 px-4 text-sm font-semibold text-gray-600">Établissements</th>
                      <th className="text-right py-2 px-4 text-sm font-semibold text-gray-600">Croissance</th>
                      <th className="text-right py-2 px-4 text-sm font-semibold text-gray-600">Saturation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topRegions.map((region) => (
                      <tr key={region.rang} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-2 px-4 text-sm font-bold text-gray-700">#{region.rang}</td>
                        <td className="py-2 px-4 text-sm font-medium text-gray-800">{region.region}</td>
                        <td className="py-2 px-4 text-sm text-right font-bold text-gray-800">{region.total.toLocaleString()}</td>
                        <td className="py-2 px-4 text-sm text-right">
                          <span className={region.croissance > 12 ? 'text-green-600 font-bold' : 'text-blue-600'}>
                            +{region.croissance}%
                          </span>
                        </td>
                        <td className="py-2 px-4 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  region.saturation > 70 ? 'bg-red-500' : 
                                  region.saturation > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${region.saturation}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{region.saturation}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Graphique détaillé */}
        {adaptedIndicators?.subItems && adaptedIndicators.subItems.length > 0 && (
          <div className="w-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Analyse Détaillée
              </h2>
              <span className="text-sm text-gray-400">{adaptedIndicators.subItems.length} sous-catégories</span>
            </div>
            <Charte menuItems={adaptedIndicators.subItems} />
          </div>
        )}
      </div>
    </div>
  );
});

export default MenuDiambra;