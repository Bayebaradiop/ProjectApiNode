import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données ECSA...');

  try {
    // 1. Créer les profils utilisateur
    console.log('📝 Création des profils utilisateur...');
    const adminProfile = await prisma.profile.upsert({
      where: { nom: 'ADMIN' },
      update: {},
      create: { nom: 'ADMIN' },
    });

    const formateurProfile = await prisma.profile.upsert({
      where: { nom: 'FORMATEUR' },
      update: {},
      create: { nom: 'FORMATEUR' },
    });

    const apprenantProfile = await prisma.profile.upsert({
      where: { nom: 'APPRENANT' },
      update: {},
      create: { nom: 'APPRENANT' },
    });

    const cmProfile = await prisma.profile.upsert({
      where: { nom: 'CM' },
      update: {},
      create: { nom: 'CM' },
    });

    // 2. Créer les profils de sortie
    console.log('🎯 Création des profils de sortie...');
    const devFrontProfile = await prisma.profilSortie.upsert({
      where: { nom: 'Développeur Front-End' },
      update: {},
      create: { nom: 'Développeur Front-End' },
    });

    const devBackProfile = await prisma.profilSortie.upsert({
      where: { nom: 'Développeur Back-End' },
      update: {},
      create: { nom: 'Développeur Back-End' },
    });

    const devFullStackProfile = await prisma.profilSortie.upsert({
      where: { nom: 'Développeur Full-Stack' },
      update: {},
      create: { nom: 'Développeur Full-Stack' },
    });

    const dataAnalystProfile = await prisma.profilSortie.upsert({
      where: { nom: 'Data Analyst' },
      update: {},
      create: { nom: 'Data Analyst' },
    });

    // 3. Créer les niveaux de compétence
    console.log('📊 Création des niveaux de compétence...');
    const niveau1 = await prisma.niveau.upsert({
      where: { nom: 'N1' },
      update: {},
      create: { nom: 'N1' },
    });

    const niveau2 = await prisma.niveau.upsert({
      where: { nom: 'N2' },
      update: {},
      create: { nom: 'N2' },
    });

    const niveau3 = await prisma.niveau.upsert({
      where: { nom: 'N3' },
      update: {},
      create: { nom: 'N3' },
    });

    // 4. Créer les compétences
    console.log('🛠️ Création des compétences...');
    const htmlCssCompetence = await prisma.competence.upsert({
      where: { nom: 'Maîtriser HTML/CSS' },
      update: {},
      create: {
        nom: 'Maîtriser HTML/CSS',
        description: 'Créer des interfaces web responsives avec HTML5 et CSS3',
      },
    });

    const javascriptCompetence = await prisma.competence.upsert({
      where: { nom: 'Développer avec JavaScript' },
      update: {},
      create: {
        nom: 'Développer avec JavaScript',
        description: 'Utiliser JavaScript pour créer des interactions dynamiques',
      },
    });

    const reactCompetence = await prisma.competence.upsert({
      where: { nom: 'Utiliser React' },
      update: {},
      create: {
        nom: 'Utiliser React',
        description: 'Développer des applications web avec React',
      },
    });

    const nodeCompetence = await prisma.competence.upsert({
      where: { nom: 'Développer avec Node.js' },
      update: {},
      create: {
        nom: 'Développer avec Node.js',
        description: 'Créer des APIs REST avec Node.js et Express',
      },
    });

    const sqlCompetence = await prisma.competence.upsert({
      where: { nom: 'Maîtriser SQL' },
      update: {},
      create: {
        nom: 'Maîtriser SQL',
        description: 'Gérer les bases de données relationnelles avec SQL',
      },
    });

    // 5. Associer compétences et niveaux
    console.log('🔗 Association compétences-niveaux...');
    await prisma.competenceNiveau.upsert({
      where: { competenceId_niveauId: { competenceId: htmlCssCompetence.id, niveauId: niveau1.id } },
      update: {},
      create: { competenceId: htmlCssCompetence.id, niveauId: niveau1.id },
    });

    await prisma.competenceNiveau.upsert({
      where: { competenceId_niveauId: { competenceId: htmlCssCompetence.id, niveauId: niveau2.id } },
      update: {},
      create: { competenceId: htmlCssCompetence.id, niveauId: niveau2.id },
    });

    await prisma.competenceNiveau.upsert({
      where: { competenceId_niveauId: { competenceId: javascriptCompetence.id, niveauId: niveau1.id } },
      update: {},
      create: { competenceId: javascriptCompetence.id, niveauId: niveau1.id },
    });

    await prisma.competenceNiveau.upsert({
      where: { competenceId_niveauId: { competenceId: javascriptCompetence.id, niveauId: niveau2.id } },
      update: {},
      create: { competenceId: javascriptCompetence.id, niveauId: niveau2.id },
    });

    await prisma.competenceNiveau.upsert({
      where: { competenceId_niveauId: { competenceId: reactCompetence.id, niveauId: niveau2.id } },
      update: {},
      create: { competenceId: reactCompetence.id, niveauId: niveau2.id },
    });

    await prisma.competenceNiveau.upsert({
      where: { competenceId_niveauId: { competenceId: nodeCompetence.id, niveauId: niveau2.id } },
      update: {},
      create: { competenceId: nodeCompetence.id, niveauId: niveau2.id },
    });

    await prisma.competenceNiveau.upsert({
      where: { competenceId_niveauId: { competenceId: sqlCompetence.id, niveauId: niveau1.id } },
      update: {},
      create: { competenceId: sqlCompetence.id, niveauId: niveau1.id },
    });

    // 6. Créer les référentiels
    console.log('📚 Création des référentiels...');
    const refDevWeb = await prisma.referentiel.upsert({
      where: { nom: 'Référentiel Développement Web' },
      update: {},
      create: {
        nom: 'Référentiel Développement Web',
        description: 'Parcours complet pour devenir développeur web full-stack',
      },
    });

    const refData = await prisma.referentiel.upsert({
      where: { nom: 'Référentiel Data & Analytics' },
      update: {},
      create: {
        nom: 'Référentiel Data & Analytics',
        description: 'Parcours pour maîtriser l\'analyse de données',
      },
    });

    // 7. Associer référentiels et compétences
    console.log('🔗 Association référentiels-compétences...');
    await prisma.referentielCompetence.upsert({
      where: { referentielId_competenceId: { referentielId: refDevWeb.id, competenceId: htmlCssCompetence.id } },
      update: {},
      create: { referentielId: refDevWeb.id, competenceId: htmlCssCompetence.id },
    });

    await prisma.referentielCompetence.upsert({
      where: { referentielId_competenceId: { referentielId: refDevWeb.id, competenceId: javascriptCompetence.id } },
      update: {},
      create: { referentielId: refDevWeb.id, competenceId: javascriptCompetence.id },
    });

    await prisma.referentielCompetence.upsert({
      where: { referentielId_competenceId: { referentielId: refDevWeb.id, competenceId: reactCompetence.id } },
      update: {},
      create: { referentielId: refDevWeb.id, competenceId: reactCompetence.id },
    });

    await prisma.referentielCompetence.upsert({
      where: { referentielId_competenceId: { referentielId: refDevWeb.id, competenceId: nodeCompetence.id } },
      update: {},
      create: { referentielId: refDevWeb.id, competenceId: nodeCompetence.id },
    });

    await prisma.referentielCompetence.upsert({
      where: { referentielId_competenceId: { referentielId: refData.id, competenceId: sqlCompetence.id } },
      update: {},
      create: { referentielId: refData.id, competenceId: sqlCompetence.id },
    });

    // 8. Créer les utilisateurs avec hashage des mots de passe
    console.log('👥 Création des utilisateurs...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@ecsa.sn' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@ecsa.sn',
        password: hashedPassword,
        profileId: adminProfile.id,
        profilSortieId: devFullStackProfile.id,
      },
    });

    const formateur1 = await prisma.user.upsert({
      where: { email: 'formateur1@ecsa.sn' },
      update: {},
      create: {
        username: 'formateur1',
        email: 'formateur1@ecsa.sn',
        password: hashedPassword,
        profileId: formateurProfile.id,
        profilSortieId: devFullStackProfile.id,
        referentielId: refDevWeb.id,
      },
    });

    const formateur2 = await prisma.user.upsert({
      where: { email: 'formateur2@ecsa.sn' },
      update: {},
      create: {
        username: 'formateur2',
        email: 'formateur2@ecsa.sn',
        password: hashedPassword,
        profileId: formateurProfile.id,
        profilSortieId: dataAnalystProfile.id,
        referentielId: refData.id,
      },
    });

    const apprenant1 = await prisma.user.upsert({
      where: { email: 'apprenant1@ecsa.sn' },
      update: {},
      create: {
        username: 'apprenant1',
        email: 'apprenant1@ecsa.sn',
        password: hashedPassword,
        profileId: apprenantProfile.id,
        profilSortieId: devFrontProfile.id,
        referentielId: refDevWeb.id,
      },
    });

    const apprenant2 = await prisma.user.upsert({
      where: { email: 'apprenant2@ecsa.sn' },
      update: {},
      create: {
        username: 'apprenant2',
        email: 'apprenant2@ecsa.sn',
        password: hashedPassword,
        profileId: apprenantProfile.id,
        profilSortieId: devBackProfile.id,
        referentielId: refDevWeb.id,
      },
    });

    const cmUser = await prisma.user.upsert({
      where: { email: 'cm@ecsa.sn' },
      update: {},
      create: {
        username: 'cm',
        email: 'cm@ecsa.sn',
        password: hashedPassword,
        profileId: cmProfile.id,
        profilSortieId: devFullStackProfile.id,
      },
    });

    // 9. Créer les promotions
    console.log('📅 Création des promotions...');
    const promo2024 = await prisma.promo.upsert({
      where: { nom: 'Promotion 2024-2025' },
      update: {},
      create: {
        nom: 'Promotion 2024-2025',
        dateDebut: new Date('2024-09-01'),
        dateFin: new Date('2025-06-30'),
        referentielId: refDevWeb.id,
      },
    });

    const promo2025 = await prisma.promo.upsert({
      where: { nom: 'Promotion 2025-2026' },
      update: {},
      create: {
        nom: 'Promotion 2025-2026',
        dateDebut: new Date('2025-09-01'),
        dateFin: new Date('2026-06-30'),
        referentielId: refData.id,
      },
    });

    // 10. Assigner les formateurs aux promotions
    console.log('👨‍🏫 Assignation des formateurs aux promotions...');
    await prisma.promoFormateurs.upsert({
      where: { promoId_userId: { promoId: promo2024.id, userId: formateur1.id } },
      update: {},
      create: { promoId: promo2024.id, userId: formateur1.id },
    });

    await prisma.promoFormateurs.upsert({
      where: { promoId_userId: { promoId: promo2025.id, userId: formateur2.id } },
      update: {},
      create: { promoId: promo2025.id, userId: formateur2.id },
    });

    console.log('🎉 Seeding terminé avec succès !');
    console.log('📊 Résumé des données créées :');
    console.log(`   - ${await prisma.profile.count()} profils`);
    console.log(`   - ${await prisma.profilSortie.count()} profils de sortie`);
    console.log(`   - ${await prisma.niveau.count()} niveaux`);
    console.log(`   - ${await prisma.competence.count()} compétences`);
    console.log(`   - ${await prisma.referentiel.count()} référentiels`);
    console.log(`   - ${await prisma.user.count()} utilisateurs`);
    console.log(`   - ${await prisma.promo.count()} promotions`);
    console.log('\n🔐 Mot de passe par défaut pour tous les utilisateurs : password123');
    console.log('📧 Comptes créés : admin@ecsa.sn, formateur1@ecsa.sn, apprenant1@ecsa.sn, etc.');

  } catch (error) {
    console.error('❌ Erreur lors du seeding :', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
