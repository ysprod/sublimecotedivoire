export enum UserType {
  BASIQUE = 'BASIQUE',
  PREMIUM = 'PREMIUM',
  INTEGRAL = 'INTEGRAL',
}

export type Category = 'animal' | 'vegetal' | 'beverage';
export type StepType = 'selection' | 'form' | 'offering' | 'processing' | 'success' | 'confirm';
export type GenerationStep = 'loading' | 'success' | 'error';
export type SortOrder = "newest" | "oldest" | "amount_high" | "amount_low";
export type HoroscopeTypeId = 'mensuel' | 'annuel';
export type ReviewFeedbackTone = "success" | "error";

export interface Section {
  titre: string;
  contenu: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormData {
  nom: string;
  prenoms: string;
  dateNaissance: string;
  paysNaissance: string;
  villeNaissance: string;
  heureNaissance: string;
  country?: string;
  phone?: string;
  gender?: string;
}

export interface Rubrique {
  id?: string;
  _id?: string;
  titre?: string;
  description?: string;
  categorie?: string;
  createdAt?: string;
  updatedAt?: string;
  categorieId?: string;
  pdfFile?: string;
  prompt?: string;
  gradeId?: string;
}

export interface Metadata {
  processingTime: number;
  tokensUsed: number;
  model: string;
  cached: boolean;
}

export interface Stats {
  totalTransactions: number;
  totalSpent: number;
}

export interface Payment {
  id: string;
  reference: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  method: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  completedAt?: string;
}

export interface User {
  photo?: string;
  presentation?: string;
  domains?: string[];
  methods?: string[];
  experience?: string[];
  poster?: string;
  video?: string;
  aspectsTexte: string;
  _id?: string;
  nom: string;
  prenoms: string;
  username: string;
  gender: 'male' | 'female';
  country: string;
  phone: string;
  dateNaissance?: Date;
  paysNaissance?: string;
  villeNaissance?: string;
  heureNaissance?: string;
  password?: string;
  role?: Role;
  createdAt: string | number | Date;
  customPermissions?: Permission[];
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  profilePicture?: string;
  isActive?: boolean;
  premium?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  preferences?: {
    language?: string;
    notifications?: boolean;
    newsletter?: boolean;
  };
  specialties?: string[];
  bio?: string;
  rating?: number;
  totalConsultations?: number;
  credits?: number;
  status?: string;
  consultationsCount?: number;
  avatar?: string;
  updatedAt?: string | Date;
  consultationsCompleted?: number;
  rituelsCompleted?: number;
  booksRead?: number;
  lastGradeUpdate?: Date | string;
  userType?: UserType;
  subscriptionStartDate?: Date | string;
  subscriptionEndDate?: Date | string;
  premiumRubriqueId?: string;
  nomconsultant?: string;
  [key: string]: unknown;
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CONSULTANT = 'CONSULTANT',
  USER = 'USER',
  GUEST = 'GUEST'
}

export enum Permission {
  CREATE_USER = 'CREATE_USER',
  READ_USER = 'READ_USER',
  READ_ANY_USER = 'READ_ANY_USER',
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_ANY_USER = 'UPDATE_ANY_USER',
  DELETE_USER = 'DELETE_USER',
  DELETE_ANY_USER = 'DELETE_ANY_USER',
  CREATE_CONSULTATION = 'CREATE_CONSULTATION',
  READ_CONSULTATION = 'READ_CONSULTATION',
  READ_ANY_CONSULTATION = 'READ_ANY_CONSULTATION',
  UPDATE_CONSULTATION = 'UPDATE_CONSULTATION',
  UPDATE_ANY_CONSULTATION = 'UPDATE_ANY_CONSULTATION',
  DELETE_CONSULTATION = 'DELETE_CONSULTATION',
  ASSIGN_CONSULTANT = 'ASSIGN_CONSULTANT',
  COMPLETE_CONSULTATION = 'COMPLETE_CONSULTATION',
  CREATE_SERVICE = 'CREATE_SERVICE',
  READ_SERVICE = 'READ_SERVICE',
  UPDATE_SERVICE = 'UPDATE_SERVICE',
  DELETE_SERVICE = 'DELETE_SERVICE',
  CREATE_PAYMENT = 'CREATE_PAYMENT',
  READ_PAYMENT = 'READ_PAYMENT',
  READ_ANY_PAYMENT = 'READ_ANY_PAYMENT',
  REFUND_PAYMENT = 'REFUND_PAYMENT',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  VIEW_LOGS = 'VIEW_LOGS',
  MANAGE_ROLES = 'MANAGE_ROLES',
  MANAGE_PERMISSIONS = 'MANAGE_PERMISSIONS',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG'
}

export interface ProcessedUserData {
  _id?: string;
  name: string;
  birthDate: string;
  prenoms: string;
  nom: string;
  phone: string;
  dateNaissance: string;
  lieuNaissance: string;
  heureNaissance: string;
  country: string;
  role: string;
  premium: boolean;
  credits: number;
  totalConsultations: number;
  rating: number;
}