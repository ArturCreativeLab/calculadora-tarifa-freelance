export enum UserRole {
  NONE = 'none',
  FREELANCER = 'freelancer',
  CLIENT = 'client',
}

export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  minMonthlySalary: number;
}

export interface Sector {
  id: string;
  name: string;
}

export interface QuizOption {
  text: string;
  points: number;
}

export interface QuizQuestion {
  id: string;
  blockTitle: string;
  questionText: string;
  options: QuizOption[];
  icon?: string; // Emoji or SVG path
}

export interface UserData {
  countryCode: string | null;
  sectorId: string | null;
  quizAnswers: Record<string, number>; // questionId: points
}

export interface CalculatedRates {
  phMinimo: number;
  phMedio: number;
  spt: number;
  tsh: number;
  tshMinimaEtica: number;
  tshSugerida: number;
  tshPremium?: number;
  marketInsight?: string; // For the new AI function
}

export enum AppScreen {
  ROLE_SELECTION = 'role_selection',
  WELCOME = 'welcome', // For Freelancer
  COUNTRY_SECTOR = 'country_sector', // For Freelancer
  QUIZ = 'quiz', // For Freelancer
  RESULTS = 'results', // For Freelancer
  CLIENT_COUNTRY_SECTOR = 'client_country_sector', // For Client
  CLIENT_INPUT = 'client_input', // For Client
  CLIENT_RESULTS = 'client_results', // For Client
}

export interface SptLevel {
  level: string;
  minSpt: number;
  maxSpt: number;
  mentorMessage: string; // Main message from prompt
  mentorTip: string; // Specific actionable tip
  recommendations: string[];
}

export interface ProjectSimulation {
  estimatedHours: number;
  numberOfPhases: number; // Simple count for now
  extras: {
    urgency: boolean;
    extendedSupport: boolean;
    usageRights: boolean;
  };
}

export interface MonthlyProjection {
  similarProjectsPerMonth: number;
}

export interface MicroLesson {
  id: string;
  title: string;
  content: string;
  link?: string;
  linkText?: string;
}

// Client Mode Types
export enum ClientExperienceLevel {
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  SPECIALIZED = 'specialized',
}

export enum ClientProjectUrgency {
  NORMAL = 'normal',
  FAST = 'fast',
  IMMEDIATE = 'immediate',
}

export enum ClientProjectVolume {
  ONE_TASK = 'one_task',
  SEVERAL_TASKS = 'several_tasks',
  RECURRENT = 'recurrent',
}

export interface ClientInputData {
  countryCode: string | null;
  sectorId: string | null;
  experienceLevel: ClientExperienceLevel;
  urgency: ClientProjectUrgency;
  volume: ClientProjectVolume;
  estimatedHoursPerTask?: number; // Optional, for more precise total cost
}

export interface ClientRateEstimate {
  phMinimoEthical: number; // Based on country's min wage
  phMedioMarket: number; // Base market average for sector/country
  recommendedRateRange: {
    min: number;
    max: number;
  };
  urgencyMultiplier: number;
  totalEstimatedCost?: { // If enough data
    min: number;
    max: number;
    explanation: string;
  };
  country: Country | null;
  sector: Sector | null;
}

export interface DataSources {
  name: string;
  url?: string;
}

// Types for AI Functions
export interface HistorialTarifaEntry {
  spt: number;
  sector: string;
  pais: string;
  tarifa_resultado: number;
}

export interface HistorialUsuarioEntry {
  // Define structure based on what you'd store for user's past rates
  fecha: string;
  sptCalculado: number;
  tarifaSugerida: number;
  phMinimoUsado: number;
  phMedioUsado: number;
}

// Type for Google Sheets Webhook Payload
export interface SheetDataPayload {
  pais: string;
  sector: string;
  spt: number;
  tshSugerida: number;
  tshMinima: number;
  tshPremium?: number; // Optional as it's not always present
  historial: string; // Assuming this is a text summary
  resultados: boolean; // Assuming this tracks if results were shown
  usoSimulador: boolean;
  usoMicrolecciones: boolean;
  timestamp?: string; // Optional: good practice to add a timestamp
  userRole?: UserRole; // Optional: to know if it's a freelancer or client
}