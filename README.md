# ECSA API - Système de Gestion des Compétences

## 🚀 Vue d'ensemble

L'API ECSA (Electronic Competency and Skills Assessment) est une plateforme complète de gestion des compétences développée avec Node.js, TypeScript et Prisma.

## 📋 Documentation

### 📖 Documentation Générale
- **[Documentation Complète](./README_API.md)** - Vue d'ensemble de toutes les APIs

### 🔗 APIs Disponibles

| API | Description | Routes | Documentation | README |
|-----|-------------|--------|---------------|--------|
| **Compétences** | Gestion des compétences et relations compétence-niveau | `/api/competences` | [📄 COMPETENCES_API.md](./COMPETENCES_API.md) | [📖 README](./README_COMPETENCES.md) |
| **Niveaux** | Gestion des niveaux de compétence | `/api/niveaux` | [📄 NIVEAUX_API.md](./NIVEAUX_API.md) | [📖 README](./README_NIVEAUX.md) |
| **Utilisateurs** | Gestion des utilisateurs | `/api/users` | [📄 USERS_API.md](./USERS_API.md) | - |
| **Profils** | Gestion des profils utilisateur | `/api/profiles` | [📄 PROFILES_API.md](./PROFILES_API.md) | - |
| **Profils de Sortie** | Gestion des profils de sortie | `/api/profilSortie` | [📄 PROFILSORTIE_API.md](./PROFILSORTIE_API.md) | - |
| **Promotions** | Gestion des promotions | `/api/promos` | [📄 PROMOS_API.md](./PROMOS_API.md) | - |
| **Référentiels** | Gestion des référentiels | `/api/referentiels` | [📄 REFERENTIELS_API.md](./REFERENTIELS_API.md) | - |
| **Tags** | Gestion des tags | `/api/tags` | [📄 TAGS_API.md](./TAGS_API.md) | - |

## 🛠️ Technologies

- **Backend** : Node.js + Express.js
- **Language** : TypeScript
- **Base de données** : MySQL + Prisma ORM
- **Validation** : Zod
- **Sécurité** : Helmet + CORS

## 🚀 Démarrage Rapide

```bash
# Installation
npm install

# Configuration
cp .env.example .env
# Éditer .env avec vos paramètres MySQL

# Base de données
npx prisma generate
npx prisma db push

# Démarrage
npm run dev
```

## 📡 Endpoints Principaux

```bash
# Santé de l'API
GET /api/health

# Compétences
GET /api/competences
POST /api/competences
GET /api/competences/:id
PUT /api/competences/:id
DELETE /api/competences/:id

# Niveaux
GET /api/niveaux
POST /api/niveaux
GET /api/niveaux/:id
PUT /api/niveaux/:id
DELETE /api/niveaux/:id

# Relations compétence-niveau
GET /api/competences/:id/niveaux
POST /api/competences/:id/niveaux
PUT /api/competences/:competenceId/niveaux/:niveauId
DELETE /api/competences/:competenceId/niveaux/:niveauId
```

## 📊 Structure des Réponses

### ✅ Succès
```json
{
  "statut": "success",
  "message": "Opération réussie",
  "data": { ... }
}
```

### ❌ Erreur
```json
{
  "statut": "error",
  "message": "Description de l'erreur",
  "data": null,
  "errors": [...]
}
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Démarrage en développement
npm run build        # Compilation TypeScript
npm run start        # Démarrage en production
npm run test         # Tests (si configurés)
```

## 📁 Structure du Projet

```
src/
├── controllers/     # Logique métier
├── routes/         # Définition des routes API
├── validators/     # Validation avec Zod
├── utils/          # Utilitaires et helpers
└── app.ts          # Configuration Express

prisma/
├── schema.prisma   # Schéma base de données
└── seed.ts         # Données de test

docs/
├── README_API.md           # Documentation générale
├── COMPETENCES_API.md      # API Compétences & Niveaux
└── ...                     # Autres documentations
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question :
- 📖 Consulter la [documentation complète](./README_API.md)
- 🐛 Ouvrir une issue sur GitHub
- 💬 Contacter l'équipe de développement

---

**Développé avec ❤️ pour le système ECSA**
