# Validateurs Zod

Ce dossier contient tous les validateurs Zod utilisés dans l'API pour valider les données d'entrée.

## Structure des validateurs

Chaque validateur suit le pattern suivant :
- `schema` : Schéma de validation pour la création
- `updateSchema` : Schéma de validation pour la mise à jour (champs optionnels)
- Types TypeScript correspondants

## Messages d'erreur

### Système de messages centralisés

Tous les messages d'erreur sont centralisés dans `error-messages.ts` pour :
- **Cohérence** : Messages uniformes dans toute l'application
- **Maintenance** : Modification facile des messages
- **Internationalisation** : Préparation pour le support multilingue

### Structure des messages

```typescript
export const errorMessages = {
  // Messages généraux
  required: (field: string) => `Le champ ${field} est requis`,
  tooShort: (field: string, min: number) => `Le champ ${field} doit contenir au moins ${min} caractères`,

  // Messages spécifiques aux champs
  nom: {
    required: 'Le nom est requis',
    invalidFormat: 'Le nom ne peut contenir que des lettres, espaces et tirets'
  },

  email: {
    required: 'L\'email est requis',
    invalidFormat: 'Format d\'email invalide'
  }
  // ... autres messages
};
```

## Liste des validateurs

### Profile
- **Fichier** : `profile.validator.ts`
- **Champs** : `nom` (requis, string, 1-100 caractères, lettres et espaces uniquement)

### ProfilSortie
- **Fichier** : `profilSortie.validator.ts`
- **Champs** : `nom` (requis, string, 1-100 caractères, lettres et espaces uniquement)

### User
- **Fichier** : `user.validator.ts`
- **Champs** :
  - `username` (requis, string, 3-50 caractères, alphanumérique + underscore)
  - `email` (requis, email valide, max 100 caractères)
  - `password` (requis, string, 8-100 caractères, doit contenir maj/min/chiffre)
  - `profileId` (requis, entier positif)
  - `profilSortieId` (optionnel, entier positif)
  - `referentielId` (optionnel, entier positif)

### Promo
- **Fichier** : `promo.validator.ts`
- **Champs** :
  - `nom` (requis, string, 1-100 caractères)
  - `dateDebut` (requis, date valide, doit être dans le futur)
  - `dateFin` (requis, date valide, doit être après dateDebut)
  - `referentielId` (optionnel, entier positif)

### Niveau
- **Fichier** : `niveau.validator.ts`
- **Champs** : `nom` (requis, string, 1-50 caractères)

### Competence
- **Fichier** : `competence.validator.ts`
- **Champs** :
  - `nom` (requis, string, 1-100 caractères, lettres/espaces/tirets)
  - `description` (optionnel, string, max 500 caractères)

### Referentiel
- **Fichier** : `referentiel.validator.ts`
- **Champs** :
  - `nom` (requis, string, 1-100 caractères, lettres/espaces/tirets)
  - `description` (optionnel, string, max 500 caractères)

### Tag
- **Fichier** : `tag.validator.ts`
- **Champs** : `nom` (requis, string, 1-50 caractères, lettres/espaces/tirets)

## Utilisation

```typescript
import { profileSchema, ProfileInput } from '../validators';

export const createProfile = (req: Request, res: Response) => {
  try {
    const validatedData: ProfileInput = profileSchema.parse(req.body);
    // Utiliser validatedData...
  } catch (error) {
    // Gérer les erreurs de validation...
  }
};
```

## Types exportés

Chaque validateur exporte :
- `Schema` : Schéma Zod pour la validation
- `UpdateSchema` : Schéma pour les mises à jour
- `Input` : Type TypeScript pour les données validées
- `UpdateInput` : Type TypeScript pour les mises à jour

## Fonctions utilitaires

### `createStringSchema(fieldName, options)`
Crée un schéma de chaîne avec validation intégrée :
- `min` : Longueur minimale
- `max` : Longueur maximale
- `pattern` : Expression régulière
- `patternMessage` : Message d'erreur personnalisé pour le pattern

### `createPositiveIntegerSchema(fieldName, required)`
Crée un schéma pour les entiers positifs.

### `createDateSchema(fieldName, options)`
Crée un schéma pour les dates avec validation temporelle :
- `future` : Doit être dans le futur
- `past` : Doit être dans le passé
- `after` : Doit être après une autre date
- `before` : Doit être avant une autre date
