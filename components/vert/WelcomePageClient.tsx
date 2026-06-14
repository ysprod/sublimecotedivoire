"use client";
import { motion } from "framer-motion";
import {
  Building2,
  Sparkles, Users, ZoomIn
} from "lucide-react";
import Image from "next/image";
import { memo, useMemo } from "react";
import CacheLink from "../commons/CacheLink";

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

export default function TourismDashboard() {
  const totaux = useMemo(() => getTotaux(), []);

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="relative">
            <Image
              src="/logos.png"
              alt="Tourisme Côte d'Ivoire"
              width={450}
              height={120}
              priority
              className="relative h-auto w-64 object-contain sm:w-72 md:w-96"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mb-4 flex justify-center"
        >
          <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2 shadow-md sm:px-5 sm:py-2.5">
            <Sparkles className="h-3.5 w-3.5 text-orange-500 animate-pulse sm:h-4 sm:w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700 sm:text-sm">
              Plateforme Nationale de Centralisation des Données du Tourisme et des Loisirs
            </span>
          </div>
        </motion.div>
      </motion.div> 

      <CacheLink href="/orange" >
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
          initial="hidden"
          animate="visible"
          className="mb-10 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2"
        >
          <StatCard title="Établissements" value={totaux.etablissements} icon={Building2} color="orange" delay={0.1} />
          <StatCard title="Clients" value={totaux.clients} icon={Users} color="amber" delay={0.2} />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="relative z-10 flex justify-center mb-10"
        >
          <Image
            src="/carteverte.png"
            alt="Touristes en Côte d'Ivoire"
            width={400}
            height={400}
            className="drop-shadow-2xl sm:w-128 sm:h-128"
          />
        </motion.div> 

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="group relative mt-6 inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-green-800 bg-[length:200%_100%] px-6 py-3 text-base font-bold text-white shadow-xl transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-2xl sm:gap-3 sm:px-8 sm:py-3.5 sm:text-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              Consulter les données par région, département et commune
              <ZoomIn className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
            </span>
            <motion.div
              animate={{ x: [-100, 100] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 to-transparent"
            />
          </motion.button>
        </motion.div>
      </CacheLink>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-12 pt-6 text-center sm:mt-16 sm:pt-8"
      >
        <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-orange-300 to-transparent sm:w-32" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500 sm:mt-6">
          République de Côte d'Ivoire — Ministère du Tourisme et des Loisirs
        </p>
        <br /><br /><br />
      </motion.div>
    </div>
  );
}