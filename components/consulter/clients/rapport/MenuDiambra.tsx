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
  FileText,  Globe,
  LineChart,
  Minus,  Percent,
  Star,
  Target,  TrendingUp,
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

// Données simulées pour les statistiques avancées
const generateDetailedStats = (total: number) => {
  return {
    parGenre: {
      hommes: Math.round(total * 0.55),
      femmes: Math.round(total * 0.45)
    },
    parAge: {
      '18-25': Math.round(total * 0.20),
      '26-35': Math.round(total * 0.30),
      '36-50': Math.round(total * 0.25),
      '50+': Math.round(total * 0.25)
    },
    parNationalite: {
      'Côte d\'Ivoire': Math.round(total * 0.40),
      'Mali': Math.round(total * 0.15),
      'Sénégal': Math.round(total * 0.12),
      'Guinée': Math.round(total * 0.10),
      'Autres': Math.round(total * 0.23)
    },
    parType: {
      'Hôtels': Math.round(total * 0.45),
      'Résidences': Math.round(total * 0.30),
      'Maisons': Math.round(total * 0.25)
    },
    activite: {
      actifs: Math.round(total * 0.75),
      inactifs: Math.round(total * 0.25)
    },
    satisfaction: {
      satisfait: Math.round(total * 0.65),
      neutre: Math.round(total * 0.25),
      insatisfait: Math.round(total * 0.10)
    }
  };
};

const MenuDiambra = memo(() => {
  const {
    handleBack,
    submenutitems,
    mainMenuItem,
    activePeriod,
    setActivePeriod  } = usePrincipale();

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'activity' | 'satisfaction'>('overview');

  // Calcul des statistiques avancées
  const stats = useMemo(() => {
    if (!mainMenuItem) return null;

    const totalClients = mainMenuItem.nbetablissements || mainMenuItem.count || 0;
    const detailedStats = generateDetailedStats(totalClients);

    // Données pour le radar
    const radarData = [
      { subject: 'Genre', A: detailedStats.parGenre.hommes / totalClients * 100, fullMark: 100 },
      { subject: 'Activité', A: detailedStats.activite.actifs / totalClients * 100, fullMark: 100 },
      { subject: 'Satisfaction', A: detailedStats.satisfaction.satisfait / totalClients * 100, fullMark: 100 },
      { subject: 'Diversité', A: Object.keys(detailedStats.parNationalite).length * 20, fullMark: 100 },
      { subject: 'Fidélité', A: 75 + Math.random() * 15, fullMark: 100 },
      { subject: 'Engagement', A: 65 + Math.random() * 25, fullMark: 100 }
    ];

    // Données d'évolution simulées
    const evolutionData = [
      { mois: 'Jan', valeur: Math.round(totalClients * 0.85), pourcentage: 85 },
      { mois: 'Fév', valeur: Math.round(totalClients * 0.88), pourcentage: 88 },
      { mois: 'Mar', valeur: Math.round(totalClients * 0.92), pourcentage: 92 },
      { mois: 'Avr', valeur: Math.round(totalClients * 0.89), pourcentage: 89 },
      { mois: 'Mai', valeur: Math.round(totalClients * 0.93), pourcentage: 93 },
      { mois: 'Jun', valeur: Math.round(totalClients * 0.96), pourcentage: 96 },
      { mois: 'Jul', valeur: Math.round(totalClients * 0.94), pourcentage: 94 },
      { mois: 'Aoû', valeur: Math.round(totalClients * 0.97), pourcentage: 97 },
      { mois: 'Sep', valeur: Math.round(totalClients * 0.95), pourcentage: 95 },
      { mois: 'Oct', valeur: Math.round(totalClients * 0.98), pourcentage: 98 },
      { mois: 'Nov', valeur: totalClients, pourcentage: 100 },
      { mois: 'Déc', valeur: Math.round(totalClients * 1.05), pourcentage: 105 }
    ];

    // Statistiques de performance
    const performance = {
      croissance: mainMenuItem.trends?.month?.value || 12.5,
      satisfaction: Math.min(95, 82 + Math.random() * 13),
      retention: Math.min(90, 70 + Math.random() * 20),
      acquisition: Math.min(30, 12 + Math.random() * 18),
      engagement: Math.min(85, 65 + Math.random() * 20),
      conversion: Math.min(25, 8 + Math.random() * 17),
      nps: Math.min(80, 45 + Math.random() * 35),
      churn: Math.min(15, 5 + Math.random() * 10)
    };

    return {
      totalClients,
      detailedStats,
      radarData,
      evolutionData,
      performance,
      tauxCroissance: performance.croissance,
      isCroissant: performance.croissance > 0
    };
  }, [mainMenuItem]);

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
    { id: 'overview', label: 'Vue d\'ensemble', icon: Calendar },
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
              <div className="flex items-center gap-4 mt-3 text-sm text-blue-200">
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
                    Évolution des Clients
                  </h2>
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
                        data={[
                          { name: 'Hommes', value: stats.detailedStats.parGenre.hommes, color: '#0088FE' },
                          { name: 'Femmes', value: stats.detailedStats.parGenre.femmes, color: '#FF8042' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(1)}%`}
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
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
                    <RechartsBarChart data={Object.entries(stats.detailedStats.parAge).map(([age, value]) => ({
                      age,
                      value
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                        <Cell fill="#0088FE" />
                        <Cell fill="#00C49F" />
                        <Cell fill="#FFBB28" />
                        <Cell fill="#FF8042" />
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
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
                    <RechartsBarChart data={Object.entries(stats.detailedStats.parNationalite).map(([country, value]) => ({
                      country,
                      value
                    }))} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="country" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" radius={[0, 8, 8, 0]}>
                        {Object.entries(stats.detailedStats.parNationalite).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#FF7F00', '#14B53A', '#00853F', '#CE1126', '#4A90D9'][index % 5]} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
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
                        data={[
                          { name: 'Actifs', value: stats.detailedStats.activite.actifs, color: '#22c55e' },
                          { name: 'Inactifs', value: stats.detailedStats.activite.inactifs, color: '#ef4444' }
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
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
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
                        data={[
                          { name: 'Satisfait', value: stats.detailedStats.satisfaction.satisfait, color: '#22c55e' },
                          { name: 'Neutre', value: stats.detailedStats.satisfaction.neutre, color: '#f59e0b' },
                          { name: 'Insatisfait', value: stats.detailedStats.satisfaction.insatisfait, color: '#ef4444' }
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
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
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
        {submenutitems.length > 0 && (
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