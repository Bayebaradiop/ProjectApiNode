import { z } from 'zod';

// Messages d'erreur personnalisés pour Zod
export const errorMessages = {
  // Messages généraux
  required: (field: string) => `Le champ ${field} est requis`,
  tooShort: (field: string, min: number) => `Le champ ${field} doit contenir au moins ${min} caractères`,
  tooLong: (field: string, max: number) => `Le champ ${field} ne peut pas dépasser ${max} caractères`,
  invalidFormat: (field: string) => `Le format du champ ${field} est invalide`,
  invalidEmail: 'Format d\'email invalide',
  invalidDate: 'Format de date invalide',
  futureDate: 'La date doit être dans le futur',
  pastDate: 'La date doit être dans le passé',
  dateAfter: (field: string) => `La date doit être postérieure à ${field}`,
  dateBefore: (field: string) => `La date doit être antérieure à ${field}`,
  positiveNumber: (field: string) => `Le champ ${field} doit être un nombre positif`,
  integerRequired: (field: string) => `Le champ ${field} doit être un entier`,
  uniqueConstraint: (field: string) => `Une valeur existe déjà pour le champ ${field}`,

  // Messages spécifiques aux champs
  nom: {
    required: 'Le nom est requis',
    tooShort: 'Le nom doit contenir au moins 1 caractère',
    tooLong: 'Le nom ne peut pas dépasser 100 caractères',
    invalidFormat: 'Le nom ne peut contenir que des lettres, espaces et tirets'
  },

  description: {
    tooLong: 'La description ne peut pas dépasser 500 caractères'
  },

  username: {
    required: 'Le nom d\'utilisateur est requis',
    tooShort: 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
    tooLong: 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères',
    invalidFormat: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'
  },

  email: {
    required: 'L\'email est requis',
    invalidFormat: 'Format d\'email invalide',
    tooLong: 'L\'email ne peut pas dépasser 100 caractères'
  },

  password: {
    required: 'Le mot de passe est requis',
    tooShort: 'Le mot de passe doit contenir au moins 8 caractères',
    tooLong: 'Le mot de passe ne peut pas dépasser 100 caractères',
    weakPassword: 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
  },

  profileId: {
    required: 'L\'ID du profil est requis',
    positiveNumber: 'L\'ID du profil doit être positif',
    integerRequired: 'L\'ID du profil doit être un entier'
  },

  dateDebut: {
    required: 'La date de début est requise',
    invalidFormat: 'Format de date de début invalide',
    futureDate: 'La date de début doit être dans le futur'
  },

  dateFin: {
    required: 'La date de fin est requise',
    invalidFormat: 'Format de date de fin invalide',
    dateAfter: 'La date de fin doit être postérieure à la date de début'
  }
};

// Fonction utilitaire pour créer des schémas avec messages d'erreur personnalisés
export const createStringSchema = (fieldName: string, options: {
  min?: number;
  max?: number;
  pattern?: RegExp;
  patternMessage?: string;
  required?: boolean;
} = {}) => {
  let schema = z.string();

  if (options.required !== false) {
    schema = schema.min(1, errorMessages.required(fieldName));
  }

  if (options.min) {
    schema = schema.min(options.min, errorMessages.tooShort(fieldName, options.min));
  }

  if (options.max) {
    schema = schema.max(options.max, errorMessages.tooLong(fieldName, options.max));
  }

  if (options.pattern) {
    schema = schema.regex(options.pattern, options.patternMessage || errorMessages.invalidFormat(fieldName));
  }

  return schema;
};

// Fonction utilitaire pour les nombres positifs
export const createPositiveIntegerSchema = (fieldName: string, required: boolean = true) => {
  let schema = z.number();

  if (required) {
    schema = schema.min(1, errorMessages.positiveNumber(fieldName));
  }

  return schema.int(errorMessages.integerRequired(fieldName));
};

// Fonction utilitaire pour les dates
export const createDateSchema = (fieldName: string, options: {
  future?: boolean;
  past?: boolean;
  after?: string;
  before?: string;
} = {}) => {
  let schema = z.string().refine((date) => !isNaN(Date.parse(date)), errorMessages.invalidDate);

  if (options.future) {
    schema = schema.refine((date) => new Date(date) >= new Date(), errorMessages.futureDate);
  }

  if (options.past) {
    schema = schema.refine((date) => new Date(date) <= new Date(), errorMessages.pastDate);
  }

  return schema;
};
