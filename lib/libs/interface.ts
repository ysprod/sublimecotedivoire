// export type FilterType = "all" | "hotel" | "residence" | "maison hote";
// export type ColorType = 'blue' | 'green' | 'red' | 'primary' | 'secondary';
// export type TabType = 'all' | 'upToDate' | 'notUpToDate';

// export type ErrorApiResponse = {
//   error: string;
//   details?: string;
// };

// export type DepartementDataType = {
//   [regionId: string]: {
//     [departementId: string]: Departement;
//   };
// };

// export type RegionsDataType = {
//   [regionId: string]: Region;
// };

export interface Region {
  a?: number | string;
  b?: string;
  c: string;
  d?: string;
  e?: string;
  f?: string;
  g: string;
  h?: string;
  i?: string;
  l?: string;
  m?: string;
}

export interface Departement {
  a?: string;
  b?: string;
  c?: string;
  d?: string;
  e?: string;
  f?: string;
  g?: string;
  h?: string;
  i?: string;
  l?: string;
  m?: string;
}

export interface DataStatistique {
  Total: number;
  Inscription: number;
  Radiation: number;
  Rectification: number;
  cod_reg: number | string;
  lib_reg: string;
}

export interface CartoFiltre {
  annee?: string;
  mois?: string;
  region?: string;
  regionId?: string;
  departementId?: string;
  departement?: string;
  localite?: string;
  tpsglobal?: number | string;
}

export interface ConfigSort {
  key: string;
  direction: "asc" | "desc";
}

export interface Filtre {
  minTotal: number;
  maxTotal: number;
  minInscription: number;
  maxInscription: number;
  minRadiation: number;
  maxRadiation: number;
  minRectification: number;
  maxRectification: number;
}

export interface ConnexionHistory {
  userId: string;
  userImage?: string;
  userName: string;
  email: string;
  role: 'admin' | 'agent' | 'manager' | 'superviseur';
  customRole?: string;
  sessionId: string;
  status: 'succes' | 'echec' | 'expiré';
  duration?: number;
  login: {
    timestamp: number;
    date: string;
    time: string;
    ipAddress: string;
    location?: {
      city?: string;
      country?: string;
      coordinates?: [number, number];
    };
  };

  logout?: {
    timestamp: number;
    date: string;
    time: string;
    reason?: 'user' | 'timeout' | 'system' | 'error';
  };

  device: {
    type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
    os: {
      name: string;
      version?: string;
    };
    browser: {
      name: 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'other';
      version?: string;
    };
    userAgent?: string;
  };

  metadata?: {
    isp?: string;
    vpn?: boolean;
    proxy?: boolean;
  };
}

export interface OptionValue {
  value: string;
  label: string;
}

export interface User {
  id?: string;
  name: string;
  email?: string;
  birthDate?: string;
  photo?: string;
}

export interface Etablissement {
  type: string;
  nom: string;
  licence: string;
  classification: string;
  chambres: number;
  region: string;
  departement: string;
  commune: string;
  quartier: string;
  adresse: string;
  telephone: string;
  email: string;
  cotisation: 'À jour' | 'Pas à jour';

  owner: {
    nom: string;
    prenom: string;
    genre: string;
    photo?: string;
    telephone: string;
    matricule?: string;
    typeagent?: string;
  };
}

export interface Owner {
  prenom: string;
  nom: string;
  genre: string;
  telephone: string;
  matricule?: string;
}

// export type TrendType = "croissance" | "baisse" | "stable";

export interface TrendData {
  direction: 'croissance' | 'baisse' | 'stable';
  value: number;
  label: string;
}

export interface AllTrends {
  day: TrendData;
  week: TrendData;
  month: TrendData;
  year: TrendData;
}

export interface MenuItem {
  id: string;
  title: string;
  count: number;
  trendValue: number;
  iconSrc: string;
  iconAlt: string;
  color: string;
  bgColor: string;
  description: string;
  trends?: AllTrends;
  nbetablissements: number;
  icon?: string;
  tpsglobal?: number;
  page?: number;
  blackicon?: string;
  trend?: TrendData;
}

export type PeriodType = 'all' | 'week' | 'month' | 'year';

export interface AdaptedIndicators {
  mainItem: MenuItem | null;
  subItems: MenuItem[];
}

// export type EtablissementType = 'hotels' | 'residences' | 'maisons' | null;
 

export interface PeriodData {
  label: string;
  value: number;
  trend: {
    direction: 'croissance' | 'baisse' | 'stable';
    value: number;
    label: string;
  };
}

 

export interface TrendResult {
  trend: TrendType;
  value: number; // Pourcentage de variation
  icon: "trending-up" | "trending-down" | "minus";
  color: string;
  description: string;
}


// lib/libs/interface.ts

// ============================================================================
// TYPES PRINCIPAUX
// ============================================================================

export type TrendType = "croissance" | "baisse" | "stable";

export interface TrendData {
  direction: 'croissance' | 'baisse' | 'stable';
  value: number;
  label: string;
}

export interface AllTrends {
  day: TrendData;
  week: TrendData;
  month: TrendData;
  year: TrendData;
}

export interface MenuItem {
  id: string;
  title: string;
  count: number;
  trendValue: number;
  iconSrc: string;
  iconAlt: string;
  color: string;
  bgColor: string;
  description: string;
  trends?: AllTrends;
  nbetablissements: number;
  icon?: string;
  tpsglobal?: number;
  page?: number;
  blackicon?: string;
  trend?: TrendData;
}

// ============================================================================
// AUTRES TYPES
// ============================================================================

export type FilterType = "all" | "hotel" | "residence" | "maison hote";
export type ColorType = 'blue' | 'green' | 'red' | 'primary' | 'secondary';
export type TabType = 'all' | 'upToDate' | 'notUpToDate';
// export type PeriodType = 'all' | 'week' | 'month' | 'year';
export type EtablissementType = 'hotels' | 'residences' | 'maisons' | null;

export interface PeriodData {
  label: string;
  value: number;
  trend: {
    direction: 'croissance' | 'baisse' | 'stable';
    value: number;
    label: string;
  };
}

export interface AdaptedIndicators {
  mainItem: MenuItem | null;
  subItems: MenuItem[];
}

// ============================================================================
// TYPES POUR LES DONNÉES GÉOGRAPHIQUES
// ============================================================================

export interface Region {
  a?: number | string;
  b?: string;
  c: string;
  d?: string;
  e?: string;
  f?: string;
  g: string;
  h?: string;
  i?: string;
  l?: string;
  m?: string;
}

export interface Departement {
  a?: string;
  b?: string;
  c?: string;
  d?: string;
  e?: string;
  f?: string;
  g?: string;
  h?: string;
  i?: string;
  l?: string;
  m?: string;
}

export interface RegionsDataType {
  [regionId: string]: Region;
}

export interface DepartementDataType {
  [regionId: string]: {
    [departementId: string]: Departement;
  };
}

// ============================================================================
// TYPES POUR LES DONNÉES STATISTIQUES
// ============================================================================

export interface DataStatistique {
  Total: number;
  Inscription: number;
  Radiation: number;
  Rectification: number;
  cod_reg: number | string;
  lib_reg: string;
}

export interface CartoFiltre {
  annee?: string;
  mois?: string;
  region?: string;
  regionId?: string;
  departementId?: string;
  departement?: string;
  localite?: string;
  tpsglobal?: number | string;
}

// ============================================================================
// TYPES POUR LES ÉTABLISSEMENTS
// ============================================================================

export interface Etablissement2 {
  type: string;
  nom: string;
  licence: string;
  classification: string;
  chambres: number;
  region: string;
  departement: string;
  commune: string;
  quartier: string;
  adresse: string;
  telephone: string;
  email: string;
  cotisation: 'À jour' | 'Pas à jour';
  owner: Owner;
}

export interface Owner {
  prenom: string;
  nom: string;
  genre: string;
  telephone: string;
  matricule?: string;
}

// ============================================================================
// TYPES POUR LA CONNEXION
// ============================================================================

export interface ConnexionHistory {
  userId: string;
  userImage?: string;
  userName: string;
  email: string;
  role: 'admin' | 'agent' | 'manager' | 'superviseur';
  customRole?: string;
  sessionId: string;
  status: 'succes' | 'echec' | 'expiré';
  duration?: number;
  login: {
    timestamp: number;
    date: string;
    time: string;
    ipAddress: string;
    location?: {
      city?: string;
      country?: string;
      coordinates?: [number, number];
    };
  };
  logout?: {
    timestamp: number;
    date: string;
    time: string;
    reason?: 'user' | 'timeout' | 'system' | 'error';
  };
  device: {
    type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
    os: {
      name: string;
      version?: string;
    };
    browser: {
      name: 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'other';
      version?: string;
    };
    userAgent?: string;
  };
  metadata?: {
    isp?: string;
    vpn?: boolean;
    proxy?: boolean;
  };
}

// ============================================================================
// TYPES UTILITAIRES
// ============================================================================

export interface OptionValue {
  value: string;
  label: string;
}

export interface User {
  id?: string;
  name: string;
  email?: string;
  birthDate?: string;
  photo?: string;
}

export interface ConfigSort {
  key: string;
  direction: "asc" | "desc";
}

export interface Filtre {
  minTotal: number;
  maxTotal: number;
  minInscription: number;
  maxInscription: number;
  minRadiation: number;
  maxRadiation: number;
  minRectification: number;
  maxRectification: number;
}

export interface ErrorApiResponse {
  error: string;
  details?: string;
}

export interface TrendResult {
  trend: TrendType;
  value: number;
  icon: "trending-up" | "trending-down" | "minus";
  color: string;
  description: string;
}