// prisma/seedData.ts

export const profiles = ['ADMIN', 'FORMATEUR', 'APPRENANT', 'CM'];

export const profilsSortie = [
  'Développeur Front-End',
  'Développeur Back-End',
  'Développeur Full-Stack',
  'Data Analyst',
];

export const niveaux = ['N1', 'N2', 'N3'];

export const competences = [
  { nom: 'Maîtriser HTML/CSS', description: 'Créer des interfaces web responsives avec HTML5 et CSS3' },
  { nom: 'Développer avec JavaScript', description: 'Utiliser JavaScript pour créer des interactions dynamiques' },
  { nom: 'Utiliser React', description: 'Développer des applications web avec React' },
  { nom: 'Développer avec Node.js', description: 'Créer des APIs REST avec Node.js et Express' },
  { nom: 'Maîtriser SQL', description: 'Gérer les bases de données relationnelles avec SQL' },
];

export const referentiels = [
  { nom: 'Référentiel Développement Web', description: 'Parcours complet pour devenir développeur web full-stack' },
  { nom: 'Référentiel Data & Analytics', description: "Parcours pour maîtriser l'analyse de données" },
];

export const tags = ['Frontend', 'Backend', 'Base de données', 'DevOps', 'Mobile'];

export const promotions = [
  { nom: 'Promotion 2024-2025', dateDebut: new Date('2024-09-01'), dateFin: new Date('2025-06-30') },
  { nom: 'Promotion 2025-2026', dateDebut: new Date('2025-09-01'), dateFin: new Date('2026-06-30') },
];

export const users = [
  { username: 'admin', email: 'admin@ecsa.sn', profile: 'ADMIN', profilSortie: 'Développeur Full-Stack' },
  { username: 'formateur1', email: 'formateur1@ecsa.sn', profile: 'FORMATEUR', profilSortie: 'Développeur Full-Stack', referentiel: 'Référentiel Développement Web' },
  { username: 'formateur2', email: 'formateur2@ecsa.sn', profile: 'FORMATEUR', profilSortie: 'Data Analyst', referentiel: 'Référentiel Data & Analytics' },
  { username: 'apprenant1', email: 'apprenant1@ecsa.sn', profile: 'APPRENANT', profilSortie: 'Développeur Front-End', referentiel: 'Référentiel Développement Web' },
  { username: 'apprenant2', email: 'apprenant2@ecsa.sn', profile: 'APPRENANT', profilSortie: 'Développeur Back-End', referentiel: 'Référentiel Développement Web' },
  { username: 'cm', email: 'cm@ecsa.sn', profile: 'CM', profilSortie: 'Développeur Full-Stack' },
];
