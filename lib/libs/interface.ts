export type FilterType = "all" | "hotel" | "residence" | "maison hote";
export type ColorType = 'blue' | 'green' | 'red' | 'primary' | 'secondary';
export type TabType = 'all' | 'upToDate' | 'notUpToDate';

export type ErrorApiResponse = {
  error: string;
  details?: string;
};

export type DepartementDataType = {
  [regionId: string]: {
    [departementId: string]: Departement;
  };
};

export type RegionsDataType = {
  [regionId: string]: Region;
};

export interface MenuItem {
  nbetablissements: number;
  title?: string;
  icon?: string;
  tpsglobal?: number;
  page?: number;
  blackicon?: string;
  trend?: {
            value: number;
            direction: "stable" | "up" | "down";
            label?: string;
        };
}

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