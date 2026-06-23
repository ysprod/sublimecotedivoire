import { CartoFiltre, ColorType, PeriodType } from '@/lib/libs/interface';
import { Filtre } from "./interface";

export const APP_NAME = "DATAKWABA ANALYTICS";
export const APP_DESCRIPTION = "Plateforme DATAKWABA";
export const APP_KEYWORDS = "DATAKWABA, ANALYTICS";
export const CHART_LOADING = "Chargement du graphique...";
export const DATA_LOADING = "Chargement des données...";
export const ERROR_MESSAGE = "Une erreur s'est produite";
export const RETRY_MESSAGE = "Reessayer";
export const METHOD_NOT_ALLOWED = "Method Non Autorisé";
export const API_INTERNAL_ERROR = "Erreur interne de l'API";
export const API_ERROR = "ERREUR API :";
export const APP_AUTHOR = { name: "YAYA SIDIBE", url: "https://www.yayasidibe.com" };
export const CURRENT_YEAR = new Date().getFullYear();
export const TITLE_SPLIT_REGEX = /(?<=\d)\s/;
export const DEFAULT_PAGINATION_COUNT = 10;
export const RESPONSE_CACHE_CONTROL = 'public, max-age=3600, stale-while-revalidate=1800';
export const ERROR_RESPONSE_OPTIONS = { status: 500, headers: { 'Content-Type': 'application/problem+json' } };
export const METHOD_NOT_ALLOWED_OPTIONS = { status: 405 };

export const MAX_PAGINATION_COUNT = 10000;
export const API_DELAY_MS = 500;
export const CACHE_TTL = 3600;
export const STALE_TTL = 300;

export const API_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
  'CDN-Cache-Control': 'public, s-maxage=3600',
  'Vercel-CDN-Cache-Control': 'public, s-maxage=3600',
  'Content-Type': 'application/json',
  'X-API-Version': '1.0'
};

export const API_HEADERS_EXTENDED = {
  'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${STALE_TTL}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_TTL}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_TTL}`,
  'Content-Type': 'application/json',
  'X-API-Version': '1.0'
};

export const RAPPORTS = [
  "RAPPORT DES DONNÉES SUR LE NOMBRE DES DIFFÉRENTS TYPES D'ÉTABLISSEMENTS HÔTELIERS DE CÔTE D'IVOIRE",
  "RAPPORT DES DONNÉES SUR LE NOMBRE DE CLIENTS DANS LES DIFFÉRENTS TYPES D'ÉTABLISSEMENTS HÔTELIERS DE CÔTE D'IVOIRE",
  "RAPPORT DES DONNÉES SUR LE NOMBRE DE CLIENTS MASCULINS DANS LES DIFFÉRENTS TYPES D'ÉTABLISSEMENTS HÔTELIERS DE CÔTE D'IVOIRE",
  "RAPPORT DES DONNÉES SUR LE NOMBRE DE CLIENTS FÉMININS DANS LES DIFFÉRENTS TYPES D'ÉTABLISSEMENTS HÔTELIERS DE CÔTE D'IVOIRE",
  "RAPPORT DES DONNÉES SUR LE NOMBRE DE CLIENTS IVOIRIENS DANS LES DIFFÉRENTS TYPES D'ÉTABLISSEMENTS HÔTELIERS DE CÔTE D'IVOIRE",
  "RAPPORT DES DONNÉES SUR LE NOMBRE DE CLIENTS ÉTRANGERS DANS LES DIFFÉRENTS TYPES D'ÉTABLISSEMENTS HÔTELIERS DE CÔTE D'IVOIRE"
] as const;

export const MONTHS = [
  { value: '01', label: 'Janvier' },
  { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },
  { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },
  { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' }
];

export const REGIONS_COORDINATES: Record<string, [number, number]> = {
  GBOKLE: [-5.928269, 5.254467],
  NAWA: [-6.6861058, 5.9478118],
  "SAN PEDRO": [-6.6463922, 4.7589989],
  "INDENIE-DJUABLIN": [-3.4689578, 6.6216454],
  "SUD-COMOE": [-3.1742961, 5.6832478],
  FOLON: [-7.4514106, 10.104917],
  KABADOUGOU: [-7.3358413, 9.3043595],
  GOH: [-6.6360889, 5.2322329],
  "LOH-DJIBOUA": [-5.4994467, 5.6945419],
  BELIER: [-4.9194344, 6.9072745],
  IFFOU: [-4.1213543, 7.4977539],
  MORONOU: [-4.1579986, 6.5942654],
  "N'ZI": [-4.4178761, 7.0103664],
  "AGNEBY-TIASSA": [-4.5420479, 5.9685016],
  "GRANDS PONTS": [-4.6488923, 5.4540163],
  "LA ME": [-3.755491, 5.932282],
  CAVALLY: [-7.5732829, 6.3032154],
  GUEMON: [-7.3504004, 6.9963016],
  TONKPI: [-7.944586, 7.3721417],
  "HAUT-SASSANDRA": [-6.6189533, 7.0304715],
  MARAHOUE: [-5.7569299, 7.1382029],
  BAGOUE: [-6.448633, 9.896245],
  PORO: [-5.7312223, 9.4760023],
  TCHOLOGO: [-4.7845119, 9.5466024],
  GBEKE: [-5.0965222, 7.6991765],
  HAMBOL: [-4.8136527, 8.6201989],
  BAFING: [-7.4228369, 8.457986],
  BERE: [-6.75, 9.0],
  WORODOUGOU: [-6.7575757, 8.3977175],
  BOUNKANI: [-3.3293652, 9.0799571],
  GONTOUGO: [-3.369677, 7.9234394],
  "ABIDJAN": [-4.016107, 5.320357],
  "YAMOUSSOKRO": [-5.2776034, 6.8200066],
};

export const STAT_LABEL_MAP: Record<number, string> = {
  1: "CLIENTS",
  2: "HOMMES",
  3: "FEMMES",
};

export const ETAB_STAT_LABEL_MAP: Record<number, string> = {
  1: "ETABLISSEMENTS",
  2: "HOMMES",
  3: "FEMMES",
};


export const fadeInUp = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const navAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: 0.6, duration: 0.5 }
};

export const buttonAnimation = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};

export const defaultFiltre: Filtre = {
  minTotal: 0,
  maxTotal: Infinity,
  minInscription: 0,
  maxInscription: Infinity,
  minRadiation: 0,
  maxRadiation: Infinity,
  minRectification: 0,
  maxRectification: Infinity,
};

export const initialCarto: CartoFiltre = {
  regionId: '',
  departementId: '',
  region: '',
  departement: '',
  localite: '',
  annee: '',
  mois: '',
  tpsglobal: 0
};

export const diambraMoov = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

export const APP_ICONS = [
  { rel: "icon", url: "/favicon.ico" },
  { rel: "icon", url: "/icons/icon-192x192.png" },
  { rel: "icon", url: "/icons/apple-icon-114x114.png", sizes: "32x32" },
  { rel: "icon", url: "/favicon-96x96.png", sizes: "96x96" },
  { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" },
];

export const TAB_ETAB_CONFIG = {
  all: { label: 'Tous les établissements', color: 'blue' },
  upToDate: { label: ' À jour des cotisations', color: 'green' },
  notUpToDate: { label: 'Pas à jour des cotisations', color: 'red' }
} as const;

export const tabAnimation = {
  ...fadeInUp, transition: { ...fadeInUp.transition, delay: 0.2, duration: 0.5 }
};

export const filtremoov = {
  ...fadeInUp,
  transition: { ...fadeInUp.transition, delay: 0.1 }
};

export const COLOR_CLASSES: Record<ColorType, { text: string; border: string }> = {
  blue: { text: 'text-blue-600', border: 'border-blue-600' },
  green: { text: 'text-green-600', border: 'border-green-600' },
  red: { text: 'text-red-600', border: 'border-red-600' },
  primary: { text: 'text-primary-600', border: 'border-primary-600' },
  secondary: { text: 'text-secondary-600', border: 'border-secondary-600' }
} as const;

export const PERIODS = ['day', 'week', 'month', 'year'] as const;

export const PERIOD_LABELS = {
    day: 'par rapport à hier',
    week: 'par rapport à la semaine dernière',
    month: 'par rapport au mois dernier',
    year: 'par rapport à l\'année dernière'
} as const;


export const PERIOD_SHORT = {
    day: 'J',
    week: 'S',
    month: 'M',
    year: 'A'
} as const;
 
export const PERIOD_BUTTONS: { id: PeriodType; label: string; icon: string }[] = [
  { id: 'all', label: 'Vue d\'ensemble', icon: '📊' },
  { id: 'week', label: 'Cette semaine', icon: '📅' },
  { id: 'month', label: 'Ce mois', icon: '📆' },
  { id: 'year', label: 'Cette année', icon: '📈' },
];