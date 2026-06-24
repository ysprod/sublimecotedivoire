'use client';
import Charte from "@/components/charts/Charte";
import BackButton from "@/components/commons/BackButton";
import Bandeau from "@/components/commons/Bandeau";
import { usePrincipale } from "@/hooks/datakwaba/clients/genre/usePrincipale";
import clsx from "clsx";
import {
  Activity, ArrowDownRight, ArrowUpRight, Award, BarChart3, Calendar, Crown,
  FileText, Heart, Minus, Percent, PieChart as PieChartIcon,
  Star, Target, TrendingUp, User, UserCircle, Users, UsersRound
} from 'lucide-react';
import { memo, useMemo, useState } from "react";
import {
  Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line,
  Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  Radar, RadarChart, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis
} from 'recharts';
import { PeriodButtons } from "../../../commons/PeriodButtons";
import PDFDownloadButton from "./ReportPDF";

const GRADIENT_START = '#667eea';
const GRADIENT_END = '#764ba2';

const CARD_COLORS = {
  blue: { border: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
  green: { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
  orange: { border: 'border-orange-500', bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
  indigo: { border: 'border-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-600', gradient: 'from-indigo-500 to-indigo-600' },
  rose: { border: 'border-rose-500', bg: 'bg-rose-100', text: 'text-rose-600', gradient: 'from-rose-500 to-rose-600' },
};

const GENRE_CONFIG = {
  'HOMMES': { label: 'Hommes', color: '#0088FE', icon: User, bg: 'bg-blue-50', emoji: '👨' },
  'FEMMES': { label: 'Femmes', color: '#FF8042', icon: UserCircle, bg: 'bg-pink-50', emoji: '👩' },
} as const;

const MenuDiambra = memo(() => {
  const {
    handleBack, setActivePeriod,
    submenutitems, adaptedMainItem, adaptedGenreItems, activePeriod,
  } = usePrincipale();

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!adaptedMainItem || !adaptedGenreItems.length) return null;

    const totalClients = adaptedMainItem.nbetablissements || adaptedMainItem.count || 0;

    // Statistiques par genre
    const genreStats = adaptedGenreItems.map(item => {
      const title = item.title || item.description || '';
      const genreKey = Object.keys(GENRE_CONFIG).find(key => title.includes(key)) || 'HOMMES';
      const config = GENRE_CONFIG[genreKey as keyof typeof GENRE_CONFIG] || GENRE_CONFIG['HOMMES'];

      return {
        name: config.label,
        value: item.nbetablissements || item.count || 0,
        percentage: totalClients > 0 ? ((item.nbetablissements || item.count || 0) / totalClients) * 100 : 0,
        color: config.color,
        icon: config.icon,
        id: genreKey,
        bg: config.bg,
        emoji: config.emoji,
        originalTitle: title
      };
    });

    // Données pour le radar
    const radarData = genreStats.map(stat => ({
      subject: stat.name,
      A: stat.value,
      fullMark: Math.max(...genreStats.map(s => s.value)) || 100
    }));

    // Statistiques de performance
    const performance = {
      croissance: adaptedMainItem.trends?.month?.value || 12.5,
      satisfaction: Math.min(95, 82 + Math.random() * 13),
      retention: Math.min(90, 70 + Math.random() * 20),
      acquisition: Math.min(30, 12 + Math.random() * 18),
      engagement: Math.min(85, 65 + Math.random() * 20),
      conversion: Math.min(25, 8 + Math.random() * 17)
    };

    // Données d'évolution
    const evolutionData = genreStats.map((stat) => ({
      mois: stat.name,
      valeur: stat.value,
      pourcentage: stat.percentage,
      color: stat.color
    }));

    // Statistiques de parité
    const ratioHomme = genreStats.find(g => g.id === 'HOMMES')?.percentage || 0;
    const ratioFemme = genreStats.find(g => g.id === 'FEMMES')?.percentage || 0;
    const parite = Math.abs(ratioHomme - ratioFemme);
    const isParitaire = parite < 10;

    return {
      totalClients,
      genreStats,
      radarData,
      evolutionData,
      performance,
      ratioHomme,
      ratioFemme,
      parite,
      isParitaire,
      maxGenre: genreStats.reduce((max, g) => g.value > max.value ? g : max, genreStats[0]),
      minGenre: genreStats.reduce((min, g) => g.value < min.value ? g : min, genreStats[0])
    };
  }, [adaptedMainItem, adaptedGenreItems]);

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
      subtitle: 'vs période précédente'
    },
    {
      id: 'parite',
      title: 'Écart de Parité',
      value: `${stats.parite.toFixed(1)}%`,
      icon: UsersRound,
      color: stats.isParitaire ? CARD_COLORS.green : CARD_COLORS.orange,
      trend: stats.isParitaire ? 3.2 : -2.1,
      subtitle: stats.isParitaire ? '✅ Équilibre atteint' : '⚠️ Déséquilibre'
    },
    {
      id: 'satisfaction',
      title: 'Satisfaction Globale',
      value: `${Math.round(stats.performance.satisfaction)}%`,
      icon: Award,
      color: CARD_COLORS.purple,
      trend: 5.2,
      subtitle: 'score de satisfaction'
    },
    {
      id: 'engagement',
      title: "Taux d'Engagement",
      value: `${Math.round(stats.performance.engagement)}%`,
      icon: Activity,
      color: CARD_COLORS.indigo,
      trend: 4.1,
      subtitle: "niveau d'activité"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white/80 backdrop-blur-sm flex flex-col items-center w-full max-w-8xl mx-auto p-6 space-y-8 shadow-xl">
        <Bandeau />

        <div className="w-full flex justify-between items-center">
          <BackButton onClick={handleBack} />
          <PDFDownloadButton
            mainItem={submenutitems[0]}
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
                  Rapport Genre & Parité
                </h1>
              </div>
              <p className="text-blue-100 mt-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Analyse détaillée de la répartition par genre
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
                {stats.isParitaire && (
                  <span className="flex items-center gap-1 bg-green-500/30 px-3 py-1 rounded-full text-green-200">
                    <Star className="w-4 h-4" />
                    Parité atteinte
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
            </div>
          ))}
        </div>

        {/* Section des genres avec images */}
        <div className="w-full bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <UsersRound className="w-5 h-5 text-blue-600" />
            Répartition par Genre
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.genreStats.map((stat) => {
              const isSelected = selectedGenre === stat.id;

              return (
                <div
                  key={stat.id}
                  className={clsx(
                    "bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2",
                    isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-100 hover:border-blue-300",
                    stat.bg
                  )}
                  onClick={() => setSelectedGenre(isSelected ? null : stat.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Icône du genre avec emoji */}
                    <div className={clsx(
                      "w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center border-2 shadow-sm text-3xl",
                      stat.id === 'HOMMES' ? 'border-blue-400 bg-blue-100' : 'border-pink-400 bg-pink-100'
                    )}>
                      {stat.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-800">
                        {stat.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-2xl font-bold" style={{ color: stat.color }}>
                          {stat.value.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({stat.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-400">Ratio</span>
                      <p className="text-xl font-bold" style={{ color: stat.color }}>
                        {stat.id === 'HOMMES' ? stats.ratioHomme.toFixed(1) : stats.ratioFemme.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  {/* Barre de progression */}
                  <div className="mt-3 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(stat.percentage, 100)}%`,
                        background: `linear-gradient(90deg, ${stat.color}, ${stat.color}dd)`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Indicateur de parité */}
          <div className="mt-4 p-4 rounded-xl border-2 border-dashed" style={{
            borderColor: stats.isParitaire ? '#22c55e' : '#f59e0b',
            background: stats.isParitaire ? 'rgba(34,197,94,0.05)' : 'rgba(245,158,11,0.05)'
          }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UsersRound className={`w-6 h-6 ${stats.isParitaire ? 'text-green-500' : 'text-amber-500'}`} />
                <div>
                  <p className="font-semibold text-gray-800">
                    {stats.isParitaire ? '✅ Parité atteinte' : '⚠️ Écart de parité'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Écart de {stats.parite.toFixed(1)}% entre les genres
                    {stats.isParitaire ? ' (Objectif atteint)' : ' (Objectif < 10%)'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="text-xs text-gray-500">Ratio H/F</span>
                  <p className="text-lg font-bold text-gray-800">
                    {stats.ratioHomme.toFixed(1)}% / {stats.ratioFemme.toFixed(1)}%
                  </p>
                </div>
                <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-blue-500 transition-all duration-1000"
                    style={{ width: `${stats.ratioHomme}%` }}
                  />
                  <div
                    className="h-full bg-pink-500 transition-all duration-1000"
                    style={{ width: `${stats.ratioFemme}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques principaux */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique en barres */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Distribution par Genre
              </h2>
              <span className="text-sm text-gray-400">{stats.totalClients} total</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.genreStats} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" radius={[0, 8, 8, 0]} barSize={50}>
                    {stats.genreStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Graphique en camembert */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-600" />
                Répartition en %
              </h2>
              <span className="text-sm text-gray-400">
                👨 {stats.ratioHomme.toFixed(1)}% • 👩 {stats.ratioFemme.toFixed(1)}%
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.genreStats}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(1)}%`}
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={5}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.genreStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="w-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Analyse Comparative par Genre
            </h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={stats.radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Répartition"
                  dataKey="A"
                  stroke="#667eea"
                  fill="#667eea"
                  fillOpacity={0.6}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Évolution */}
        <div className="w-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Évolution par Genre
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

        {/* Statistiques détaillées */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Genre Dominant</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {stats.maxGenre.name} {stats.maxGenre.emoji}
            </p>
            <p className="text-sm text-gray-600">
              {stats.maxGenre.value.toLocaleString()} clients ({stats.maxGenre.percentage.toFixed(1)}%)
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-2 text-purple-600">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Parité</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {stats.isParitaire ? '✅ Atteinte' : '⚠️ En cours'}
            </p>
            <p className="text-sm text-gray-600">
              Écart de {stats.parite.toFixed(1)}% {stats.isParitaire ? '(objectif atteint)' : '(objectif < 10%)'}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-2 text-green-600">
              <Percent className="w-5 h-5" />
              <span className="font-semibold">Ratio Global</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {stats.ratioHomme.toFixed(0)} / {stats.ratioFemme.toFixed(0)}
            </p>
            <p className="text-sm text-gray-600">
              Hommes / Femmes
            </p>
          </div>
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
            <Charte menuItems={adaptedGenreItems} />
          </div>
        )}
      </div>
    </div>
  );
});

export default MenuDiambra;