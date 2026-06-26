'use client';

import Charte from "@/components/charts/Charte";
import BackButton from "@/components/commons/BackButton";
import Bandeau from "@/components/commons/Bandeau";
import { usePrincipale } from "@/hooks/datakwaba/clients/usePrincipale";
import clsx from "clsx";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Building2,
  Calendar,
  Crown,
  FileText,
  Globe,
  LineChart,
  Minus,
  Percent,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  UsersRound
} from 'lucide-react';
import { memo, useMemo, useState } from "react";
import {
  Area,
  Bar,
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
  BarChart as RechartsBarChart,
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
};

// DONNÉES STATIQUES DU RAPPORT CLIENT
const RAPPORT_CLIENT_DATA = {
  totalClients: 10000,
  parGenre: {
    hommes: 5500,
    femmes: 4500
  },
  parAge: {
    '18-25 ans': 2000,
    '26-35 ans': 3000,
    '36-50 ans': 2500,
    '50+ ans': 2500
  },
  parNationalite: {
    "Côte d'Ivoire": 4000,
    'Mali': 1500,
    'Sénégal': 1200,
    'Guinée': 1000,
    'Autres': 2300
  },
  parType: {
    'Hôtels': 4500,
    'Résidences': 3000,
    "Maisons d'Hôtes": 2500
  },
  activite: {
    actifs: 7500,
    inactifs: 2500
  },
  satisfaction: {
    satisfait: 6500,
    neutre: 2500,
    insatisfait: 1000
  },
  performance: {
    croissance: 12.5,
    satisfaction: 92,
    retention: 82,
    acquisition: 18,
    engagement: 75,
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
  radarData: [
    { subject: 'Genre', A: 55, fullMark: 100 },
    { subject: 'Activité', A: 75, fullMark: 100 },
    { subject: 'Satisfaction', A: 92, fullMark: 100 },
    { subject: 'Diversité', A: 80, fullMark: 100 },
    { subject: 'Fidélité', A: 82, fullMark: 100 },
    { subject: 'Engagement', A: 75, fullMark: 100 }
  ]
};

const MenuDiambra = memo(() => {
  const {
    handleBack,
    submenutitems,
    mainMenuItem,
    activePeriod,
    setActivePeriod
  } = usePrincipale();

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'activity' | 'satisfaction'>('overview');

  // Utilisation des données du rapport
  const stats = useMemo(() => {
    const totalClients = RAPPORT_CLIENT_DATA.totalClients;

    // Données pour les graphiques par genre
    const genreData = [
      { name: 'Hommes', value: RAPPORT_CLIENT_DATA.parGenre.hommes, color: '#0088FE' },
      { name: 'Femmes', value: RAPPORT_CLIENT_DATA.parGenre.femmes, color: '#FF8042' }
    ];

    // Données pour les tranches d'âge
    const ageData = Object.entries(RAPPORT_CLIENT_DATA.parAge).map(([age, value]) => ({
      age,
      value,
      color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][Object.keys(RAPPORT_CLIENT_DATA.parAge).indexOf(age)]
    }));

    // Données pour les nationalités
    const nationaliteData = Object.entries(RAPPORT_CLIENT_DATA.parNationalite).map(([country, value]) => ({
      country,
      value
    }));

    // Données pour les types d'établissement
    const typeData = Object.entries(RAPPORT_CLIENT_DATA.parType).map(([type, value]) => ({
      name: type,
      value,
      color: ['#0088FE', '#00C49F', '#FFBB28'][Object.keys(RAPPORT_CLIENT_DATA.parType).indexOf(type)]
    }));

    // Données de satisfaction
    const satisfactionData = [
      { name: 'Satisfait', value: RAPPORT_CLIENT_DATA.satisfaction.satisfait, color: '#22c55e' },
      { name: 'Neutre', value: RAPPORT_CLIENT_DATA.satisfaction.neutre, color: '#f59e0b' },
      { name: 'Insatisfait', value: RAPPORT_CLIENT_DATA.satisfaction.insatisfait, color: '#ef4444' }
    ];

    // Données d'activité
    const activiteData = [
      { name: 'Actifs', value: RAPPORT_CLIENT_DATA.activite.actifs, color: '#22c55e' },
      { name: 'Inactifs', value: RAPPORT_CLIENT_DATA.activite.inactifs, color: '#ef4444' }
    ];

    return {
      totalClients,
      genreData,
      ageData,
      nationaliteData,
      typeData,
      satisfactionData,
      activiteData,
      evolutionData: RAPPORT_CLIENT_DATA.evolutionMensuelle,
      radarData: RAPPORT_CLIENT_DATA.radarData,
      performance: RAPPORT_CLIENT_DATA.performance,
      tauxCroissance: RAPPORT_CLIENT_DATA.performance.croissance,
      isCroissant: RAPPORT_CLIENT_DATA.performance.croissance > 0,
      detailedStats: RAPPORT_CLIENT_DATA
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
      title: 'Total Clients',
      value: stats.totalClients.toLocaleString(),
      icon: Users,
      color: CARD_COLORS.blue,
      trend: stats.performance.croissance,
      subtitle: 'vs période précédente',
      detail: `+${stats.performance.acquisition}% d'acquisition`
    },
    {
      id: 'satisfaction',
      title: 'Satisfaction Globale',
      value: `${Math.round(stats.performance.satisfaction)}%`,
      icon: Award,
      color: CARD_COLORS.green,
      trend: 5.2,
      subtitle: 'score de satisfaction',
      detail: `${Math.round(stats.performance.nps)} NPS`
    },
    {
      id: 'retention',
      title: 'Taux de Rétention',
      value: `${Math.round(stats.performance.retention)}%`,
      icon: UserCheck,
      color: CARD_COLORS.purple,
      trend: 3.8,
      subtitle: 'taux de fidélisation',
      detail: `${Math.round(stats.performance.churn)}% de churn`
    },
    {
      id: 'engagement',
      title: "Taux d'Engagement",
      value: `${Math.round(stats.performance.engagement)}%`,
      icon: Activity,
      color: CARD_COLORS.indigo,
      trend: 4.1,
      subtitle: "niveau d'activité",
      detail: `${stats.detailedStats.activite.actifs.toLocaleString()} actifs`
    }
  ];

  // Onglets de navigation
  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LineChart },
    { id: 'demographics', label: 'Démographie', icon: UsersRound },
    { id: 'activity', label: 'Activité', icon: Activity },
    { id: 'satisfaction', label: 'Satisfaction', icon: Award }
  ] as const;

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white/80 backdrop-blur-sm flex flex-col items-center w-full max-w-8xl mx-auto p-6 space-y-8 shadow-xl">
        <Bandeau />

        <div className="w-full flex justify-between items-center">
          <BackButton onClick={handleBack} />
          <PDFDownloadButton
            mainItem={mainMenuItem}
            hotelItems={submenutitems}
            subItems={submenutitems}
          />
        </div>

        {/* En-tête institutionnel */}
        <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-300" />
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  Rapport Global Clients
                </h1>
              </div>
              <p className="text-blue-100 mt-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Analyse complète de la base clientèle
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
                  <Users className="w-4 h-4" />
                  {stats.totalClients.toLocaleString()} clients analysés
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
                    Évolution des Clients (2024)
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
                    <UsersRound className="w-5 h-5" />
                    <span className="font-semibold">Genre</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {stats.detailedStats.parGenre.hommes.toLocaleString()} / {stats.detailedStats.parGenre.femmes.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Hommes / Femmes</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 text-green-600">
                    <Globe className="w-5 h-5" />
                    <span className="font-semibold">Nationalités</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {Object.keys(stats.detailedStats.parNationalite).length}
                  </p>
                  <p className="text-xs text-gray-500">pays représentés</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Building2 className="w-5 h-5" />
                    <span className="font-semibold">Types</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {Object.keys(stats.detailedStats.parType).length}
                  </p>
                  <p className="text-xs text-gray-500">catégories</p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Percent className="w-5 h-5" />
                    <span className="font-semibold">Croissance</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    +{stats.tauxCroissance}%
                  </p>
                  <p className="text-xs text-gray-500">taux de croissance</p>
                </div>
              </div>
            </div>
          )}

          {/* Démographie */}
          {activeTab === 'demographics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition par genre */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <UsersRound className="w-5 h-5 text-blue-600" />
                  Par Genre
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.genreData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(1)}%`}
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                      >
                        {stats.genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Hommes</p>
                    <p className="text-xl font-bold text-blue-600">{stats.detailedStats.parGenre.hommes.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">55%</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Femmes</p>
                    <p className="text-xl font-bold text-orange-600">{stats.detailedStats.parGenre.femmes.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">45%</p>
                  </div>
                </div>
                <div className="mt-3 text-center text-sm text-gray-500">
                  Ratio H/F: <span className="font-bold">1.22</span>
                </div>
              </div>

              {/* Répartition par âge */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-purple-600" />
                  Par Tranche d'Âge
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={stats.ageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {stats.ageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                  {stats.ageData.map((item) => (
                    <div key={item.age} className="bg-gray-50 rounded p-2">
                      <span className="font-bold text-gray-700">{item.value.toLocaleString()}</span>
                      <span className="text-gray-500 block">{item.age}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Répartition par nationalité */}
              <div className="bg-white rounded-xl p-6 shadow-lg lg:col-span-2">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-green-600" />
                  Par Nationalité
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={stats.nationaliteData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="country" width={120} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {stats.nationaliteData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#FF7F00', '#14B53A', '#00853F', '#CE1126', '#4A90D9'][index % 5]} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  {stats.nationaliteData.map((item) => (
                    <span key={item.country} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {item.country}: <strong>{item.value.toLocaleString()}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Répartition par type d'établissement */}
              <div className="bg-white rounded-xl p-6 shadow-lg lg:col-span-2">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  Par Type d'Établissement
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.typeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(1)}%`}
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                      >
                        {stats.typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                  {stats.typeData.map((item) => (
                    <div key={item.name} className="bg-gray-50 rounded-lg p-2">
                      <p className="font-bold text-gray-800">{item.value.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Activité */}
          {activeTab === 'activity' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-green-600" />
                  Niveau d'Activité
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.activiteData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(1)}%`}
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                      >
                        {stats.activiteData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Actifs</p>
                    <p className="text-xl font-bold text-green-600">{stats.detailedStats.activite.actifs.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">75%</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Inactifs</p>
                    <p className="text-xl font-bold text-red-600">{stats.detailedStats.activite.inactifs.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">25%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Radar d'Activité
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
                        data={stats.satisfactionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(1)}%`}
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                      >
                        {stats.satisfactionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  {stats.satisfactionData.map((item) => (
                    <div key={item.name} className="bg-gray-50 rounded-lg p-2">
                      <p className="font-bold text-gray-800">{item.value.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Indicateurs de Satisfaction
                </h3>
                <div className="space-y-4">
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
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Satisfaction Globale</span>
                      <span className="font-bold text-gray-800">{Math.round(stats.performance.satisfaction)}%</span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" style={{ width: `${stats.performance.satisfaction}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Graphique détaillé */}
        {submenutitems && submenutitems.length > 0 && (
          <div className="w-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Analyse Détaillée
              </h2>
              <span className="text-sm text-gray-400">{submenutitems.length} sous-catégories</span>
            </div>
            <Charte menuItems={submenutitems} />
          </div>
        )}
      </div>
    </div>
  );
});

export default MenuDiambra;