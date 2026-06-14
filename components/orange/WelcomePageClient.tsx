"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Award, BarChart3, Building2,
  Calendar, Filter, Globe, Hotel, MapPin, MapPinned,
  Search, Sparkles, Star, TrendingUp, Users, ZoomIn
} from "lucide-react";
import Image from "next/image";
import { memo, Suspense, useMemo, useState } from "react";

interface HotelStats {
  etablissements: number;
  clients: number;
  tauxOccupation: number;
  revenuMoyen: number;
  etoiles: number;
}

interface CommuneData {
  nom: string;
  stats: HotelStats;
}

interface DepartementData {
  nom: string;
  communes: CommuneData[];
}

interface RegionData {
  nom: string;
  departements: DepartementData[];
}

const hotelData: RegionData[] = [
  {
    nom: "Abidjan",
    departements: [
      {
        nom: "Abidjan",
        communes: [
          { nom: "Plateau", stats: { etablissements: 128, clients: 245000, tauxOccupation: 78, revenuMoyen: 125000, etoiles: 4 } },
          { nom: "Cocody", stats: { etablissements: 95, clients: 189000, tauxOccupation: 75, revenuMoyen: 110000, etoiles: 4 } },
          { nom: "Marcory", stats: { etablissements: 72, clients: 142000, tauxOccupation: 71, revenuMoyen: 95000, etoiles: 3 } },
          { nom: "Yopougon", stats: { etablissements: 58, clients: 98000, tauxOccupation: 65, revenuMoyen: 75000, etoiles: 3 } },
          { nom: "Treichville", stats: { etablissements: 45, clients: 87000, tauxOccupation: 68, revenuMoyen: 82000, etoiles: 3 } },
        ],
      },
    ],
  },
  {
    nom: "Yamoussoukro",
    departements: [
      {
        nom: "Yamoussoukro",
        communes: [
          { nom: "Yamoussoukro Centre", stats: { etablissements: 42, clients: 68000, tauxOccupation: 62, revenuMoyen: 68000, etoiles: 3 } },
          { nom: "Kokrenou", stats: { etablissements: 18, clients: 29000, tauxOccupation: 55, revenuMoyen: 52000, etoiles: 2 } },
        ],
      },
    ],
  },
  {
    nom: "San-Pédro",
    departements: [
      {
        nom: "San-Pédro",
        communes: [
          { nom: "San-Pédro Ville", stats: { etablissements: 56, clients: 98000, tauxOccupation: 67, revenuMoyen: 78000, etoiles: 3 } },
          { nom: "Doba", stats: { etablissements: 12, clients: 21000, tauxOccupation: 52, revenuMoyen: 45000, etoiles: 2 } },
        ],
      },
    ],
  },
  {
    nom: "Bouaké",
    departements: [
      {
        nom: "Bouaké",
        communes: [
          { nom: "Bouaké Centre", stats: { etablissements: 64, clients: 112000, tauxOccupation: 66, revenuMoyen: 72000, etoiles: 3 } },
          { nom: "Koko", stats: { etablissements: 22, clients: 41000, tauxOccupation: 58, revenuMoyen: 55000, etoiles: 2 } },
        ],
      },
    ],
  },
  {
    nom: "Korhogo",
    departements: [
      {
        nom: "Korhogo",
        communes: [
          { nom: "Korhogo Ville", stats: { etablissements: 39, clients: 74000, tauxOccupation: 64, revenuMoyen: 65000, etoiles: 3 } },
          { nom: "Niofoin", stats: { etablissements: 9, clients: 15000, tauxOccupation: 48, revenuMoyen: 38000, etoiles: 2 } },
        ],
      },
    ],
  },
  {
    nom: "Man",
    departements: [
      {
        nom: "Man",
        communes: [
          { nom: "Man Centre", stats: { etablissements: 34, clients: 62000, tauxOccupation: 63, revenuMoyen: 62000, etoiles: 3 } },
          { nom: "Logoualé", stats: { etablissements: 8, clients: 14000, tauxOccupation: 51, revenuMoyen: 40000, etoiles: 2 } },
        ],
      },
    ],
  },
  {
    nom: "Daloa",
    departements: [
      {
        nom: "Daloa",
        communes: [
          { nom: "Daloa Ville", stats: { etablissements: 52, clients: 95000, tauxOccupation: 65, revenuMoyen: 70000, etoiles: 3 } },
          { nom: "Zagoué", stats: { etablissements: 11, clients: 22000, tauxOccupation: 53, revenuMoyen: 46000, etoiles: 2 } },
        ],
      },
    ],
  },
];

const formatter = new Intl.NumberFormat("fr-FR");

const getTotaux = () => {
  let totalEtab = 0;
  let totalClients = 0;
  let totalOccPondere = 0;
  let totalEtabOcc = 0;

  hotelData.forEach((region) => {
    region.departements.forEach((dept) => {
      dept.communes.forEach((commune) => {
        totalEtab += commune.stats.etablissements;
        totalClients += commune.stats.clients;
        totalOccPondere += commune.stats.tauxOccupation * commune.stats.etablissements;
        totalEtabOcc += commune.stats.etablissements;
      });
    });
  });

  return {
    etablissements: totalEtab,
    clients: totalClients,
    tauxOccupation: totalEtabOcc > 0 ? Math.round(totalOccPondere / totalEtabOcc) : 0,
  };
};

const StatCard = memo(({ title, value, icon: Icon, color, suffix = "", delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
    whileHover={{ scale: 1.03, y: -8 }}
    className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl"
  >
    <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-${color}-100 blur-2xl transition-all duration-500 group-hover:scale-150`} />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">{title}</p>
        <motion.p
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
          className="mt-2 text-4xl font-black text-gray-800"
        >
          {typeof value === "number" ? formatter.format(value) : value}
          <span className="ml-1 text-xl text-gray-400">{suffix}</span>
        </motion.p>
      </div>
      <div className={`rounded-2xl bg-${color}-100 p-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ delay: delay + 0.3, duration: 0.8 }}
      className={`mt-4 h-1 rounded-full bg-${color}-200`}
    />
    <div className={`mt-3 h-0.5 w-0 rounded-full bg-${color}-500 transition-all duration-500 group-hover:w-full`} />
  </motion.div>
));

StatCard.displayName = "StatCard";

// Composant principal
function DashboardContent() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedCommune, setSelectedCommune] = useState<string>("all");
  const [isHoveringFilter, setIsHoveringFilter] = useState(false);

  const totaux = useMemo(() => getTotaux(), []);

  const departements = useMemo(() => {
    if (selectedRegion === "all") return ["all"];
    const region = hotelData.find((r) => r.nom === selectedRegion);
    return ["all", ...(region?.departements.map((d) => d.nom) || [])];
  }, [selectedRegion]);

  const communes = useMemo(() => {
    if (selectedRegion === "all" || selectedDept === "all") return ["all"];
    const region = hotelData.find((r) => r.nom === selectedRegion);
    const dept = region?.departements.find((d) => d.nom === selectedDept);
    return ["all", ...(dept?.communes.map((c) => c.nom) || [])];
  }, [selectedRegion, selectedDept]);

  const filteredStats = useMemo(() => {
    let etablissements = 0;
    let clients = 0;
    let occPondere = 0;
    let totalEtab = 0;

    hotelData.forEach((region) => {
      if (selectedRegion !== "all" && region.nom !== selectedRegion) return;
      region.departements.forEach((dept) => {
        if (selectedDept !== "all" && dept.nom !== selectedDept) return;
        dept.communes.forEach((commune) => {
          if (selectedCommune !== "all" && commune.nom !== selectedCommune) return;
          etablissements += commune.stats.etablissements;
          clients += commune.stats.clients;
          occPondere += commune.stats.tauxOccupation * commune.stats.etablissements;
          totalEtab += commune.stats.etablissements;
        });
      });
    });

    return {
      etablissements,
      clients,
      tauxOccupation: totalEtab > 0 ? Math.round(occPondere / totalEtab) : 0,
    };
  }, [selectedRegion, selectedDept, selectedCommune]);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedDept("all");
    setSelectedCommune("all");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative overflow-x-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className=" text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full" />
              <Image
                src="/logos.png"
                alt="Tourisme Côte d'Ivoire"
                width={450}
                height={120}
                priority
                className="relative h-auto w-80 object-contain md:w-96"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="mb-5 flex justify-center"
          >
            <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-5 py-2.5 shadow-md">
              <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wider text-orange-700">
                Plateforme Nationale de Centralisation des Données du Tourisme et des Loisirs
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <StatCard title="Établissements" value={totaux.etablissements} icon={Building2} color="orange" delay={0.1} />
          <StatCard title="Clients (annuels)" value={totaux.clients} icon={Users} color="amber" delay={0.2} />
          <StatCard title="Occupation moyenne" value={totaux.tauxOccupation} icon={TrendingUp} color="yellow" suffix="%" delay={0.3} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
          onHoverStart={() => setIsHoveringFilter(true)}
          onHoverEnd={() => setIsHoveringFilter(false)}
          className="relative mb-10 overflow-hidden rounded-3xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl"
        >
          <motion.div
            animate={{ scale: isHoveringFilter ? 1.1 : 1 }}
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 blur-2xl"
          />

          <div className="relative flex items-center gap-3 mb-5">
            <div className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-2">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Consultez les données par</h3>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
            >
              <ArrowRight className="h-5 w-5 text-orange-500" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <motion.div variants={itemVariants}>
              <label className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
                <Globe className="h-4 w-4 text-orange-500" />
                Région
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-200"
              >
                <option value="all">🌍 Toutes les régions</option>
                {hotelData.map((region) => (
                  <option key={region.nom} value={region.nom}>
                    📍 {region.nom}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
                <MapPin className="h-4 w-4 text-orange-500" />
                Département
              </label>
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setSelectedCommune("all");
                }}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-200 disabled:opacity-50"
                disabled={selectedRegion === "all"}
              >
                {departements.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "📌 Tous les départements" : `🏛️ ${dept}`}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
                <Building2 className="h-4 w-4 text-orange-500" />
                Commune
              </label>
              <select
                value={selectedCommune}
                onChange={(e) => setSelectedCommune(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-200 disabled:opacity-50"
                disabled={selectedRegion === "all" || selectedDept === "all"}
              >
                {communes.map((com) => (
                  <option key={com} value={com}>
                    {com === "all" ? "🏘️ Toutes les communes" : `🏠 ${com}`}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedRegion}-${selectedDept}-${selectedCommune}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 0.5 }}
                    className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 p-2.5 shadow-md"
                  >
                    <Search className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">Résultats filtrés</p>
                    <p className="text-xl font-bold text-gray-800">
                      {formatter.format(filteredStats.etablissements)} établissements • {formatter.format(filteredStats.clients)} clients
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 shadow-md"
                >
                  <span className="text-sm font-bold text-white">
                    Taux d'occupation: {filteredStats.tauxOccupation}%
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          className="group relative mb-10 flex justify-center perspective-1000"
        >
          <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-50" />
          <div className="relative flex h-[300px] w-full max-w-md items-center justify-center overflow-hidden rounded-[40px] bg-white shadow-2xl transition-all duration-500 group-hover:shadow-3xl md:h-[340px] md:max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1),transparent_70%)]" />
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <MapPinned size={240} className="absolute text-orange-200/50 md:size-[280px]" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Image
                src="/touristes.png"
                alt="Touristes en Côte d'Ivoire"
                width={260}
                height={260}
                className="drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            className="mb-3 flex items-center justify-center gap-2"
          >
            <Award className="h-6 w-6 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-800">Explorez les données de la Côte d'Ivoire</h2>
          </motion.div>
          <p className="text-gray-600">
            Données centralisées par le Ministère du Tourisme et des Loisirs
          </p>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="
              group
              relative
              mt-8
              inline-flex
              items-center
              gap-3
              overflow-hidden
              rounded-2xl
              bg-gradient-to-r
              from-orange-500
              via-amber-500
              to-orange-500
              bg-[length:200%_100%]
              px-10
              py-4
              text-lg
              font-bold
              text-white
              shadow-xl
              transition-all
              duration-500
              hover:bg-[position:100%_0]
              hover:shadow-2xl
            "
          >
            <span className="relative z-10 flex items-center gap-2">
              Accéder aux données détaillées
              <ZoomIn className="h-5 w-5 transition-transform group-hover:scale-110" />
            </span>
            <motion.div
              animate={{ x: [-100, 100] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 to-transparent"
            />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 pt-8 text-center"
        >
          <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
            République de Côte d'Ivoire — Ministère du Tourisme et des Loisirs
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5">
              <Hotel className="h-3.5 w-3.5" />
              {formatter.format(totaux.etablissements)} établissements recensés
            </motion.span>
            <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Données 2026
            </motion.span>
            <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              Mise à jour quotidienne
            </motion.span>
            <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              + de 2500 hôtels partenaires
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const LoadingFallback = memo(() => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-white">
    <div className="text-center">
      <div className="relative mx-auto h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-orange-200" />
        <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin" />
      </div>
      <p className="mt-4 text-gray-500">Chargement du tableau de bord...</p>
    </div>
  </div>
));

export default function TourismDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardContent />
    </Suspense>
  );
}