import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données ECSA...');

  try {
    // 1. Profils
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

    // 2. Profils de sortie
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

    // 3. Niveaux
    const [niveau1, niveau2, niveau3] = await Promise.all([
      prisma.niveau.upsert({ where: { nom: 'N1' }, update: {}, create: { nom: 'N1' } }),
      prisma.niveau.upsert({ where: { nom: 'N2' }, update: {}, create: { nom: 'N2' } }),
      prisma.niveau.upsert({ where: { nom: 'N3' }, update: {}, create: { nom: 'N3' } }),
    ]);

    // 4. Compétences
    const [htmlCss, js, react, node, sql] = await Promise.all([
      prisma.competence.upsert({
        where: { nom: 'Maîtriser HTML/CSS' },
        update: {},
        create: {
          nom: 'Maîtriser HTML/CSS',
          description: 'Créer des interfaces web responsives avec HTML5 et CSS3',
        },
      }),
      prisma.competence.upsert({
        where: { nom: 'Développer avec JavaScript' },
        update: {},
        create: {
          nom: 'Développer avec JavaScript',
          description: 'Utiliser JavaScript pour créer des interactions dynamiques',
        },
      }),
      prisma.competence.upsert({
        where: { nom: 'Utiliser React' },
        update: {},
        create: {
          nom: 'Utiliser React',
          description: 'Développer des applications web avec React',
        },
      }),
      prisma.competence.upsert({
        where: { nom: 'Développer avec Node.js' },
        update: {},
        create: {
          nom: 'Développer avec Node.js',
          description: 'Créer des APIs REST avec Node.js et Express',
        },
      }),
      prisma.competence.upsert({
        where: { nom: 'Maîtriser SQL' },
        update: {},
        create: {
          nom: 'Maîtriser SQL',
          description: 'Gérer les bases de données relationnelles avec SQL',
        },
      }),
    ]);

    // 5. Liaisons compétences-niveaux
    const niveauMap = [niveau1, niveau2];
    for (const niveau of niveauMap) {
      await prisma.competenceNiveau.upsert({
        where: { competenceId_niveauId: { competenceId: htmlCss.id, niveauId: niveau.id } },
        update: {},
        create: { competenceId: htmlCss.id, niveauId: niveau.id },
      });

      await prisma.competenceNiveau.upsert({
        where: { competenceId_niveauId: { competenceId: js.id, niveauId: niveau.id } },
        update: {},
        create: { competenceId: js.id, niveauId: niveau.id },
      });
    }

    await prisma.competenceNiveau.createMany({
      data: [
        { competenceId: react.id, niveauId: niveau2.id },
        { competenceId: node.id, niveauId: niveau2.id },
        { competenceId: sql.id, niveauId: niveau1.id },
      ],
      skipDuplicates: true,
    });

    // 6. Référentiels
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
        description: "Parcours pour maîtriser l'analyse de données",
      },
    });

    // 7. Compétences associées aux référentiels
    await prisma.referentielCompetence.createMany({
      data: [
        { referentielId: refDevWeb.id, competenceId: htmlCss.id },
        { referentielId: refDevWeb.id, competenceId: js.id },
        { referentielId: refDevWeb.id, competenceId: react.id },
        { referentielId: refDevWeb.id, competenceId: node.id },
        { referentielId: refData.id, competenceId: sql.id },
      ],
      skipDuplicates: true,
    });

    // 8. Utilisateurs
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
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

    const cm = await prisma.user.upsert({
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

    // 9. Promotions
    const promo2024 = await prisma.promo.upsert({
      where: { nom: 'Promotion 2024-2025' },
      update: {},
      create: {
        nom: 'Promotion 2024-2025',
        dateDebut: new Date('2024-09-01'),
        dateFin: new Date('2025-06-30'),
      },
    });

    const promo2025 = await prisma.promo.upsert({
      where: { nom: 'Promotion 2025-2026' },
      update: {},
      create: {
        nom: 'Promotion 2025-2026',
        dateDebut: new Date('2025-09-01'),
        dateFin: new Date('2026-06-30'),
      },
    });

    // 10. Lien promo <-> référentiel
    await prisma.promoReferentiel.createMany({
      data: [
        { promoId: promo2024.id, referentielId: refDevWeb.id },
        { promoId: promo2025.id, referentielId: refData.id },
      ],
      skipDuplicates: true,
    });

    // 11. Formateurs dans les promos
    await prisma.promoFormateurs.createMany({
      data: [
        { promoId: promo2024.id, userId: formateur1.id },
        { promoId: promo2025.id, userId: formateur2.id },
      ],
      skipDuplicates: true,
    });

    // ✅ Résumé
    console.log('🎉 Seeding terminé avec succès !');
    console.log('📊 Résumé :');
    console.log(`   - ${await prisma.profile.count()} profils`);
    console.log(`   - ${await prisma.profilSortie.count()} profils de sortie`);
    console.log(`   - ${await prisma.niveau.count()} niveaux`);
    console.log(`   - ${await prisma.competence.count()} compétences`);
    console.log(`   - ${await prisma.referentiel.count()} référentiels`);
    console.log(`   - ${await prisma.user.count()} utilisateurs`);
    console.log(`   - ${await prisma.promo.count()} promotions`);
    console.log(`   - ${await prisma.promoReferentiel.count()} associations promo/référentiel`);
    console.log('\n🔐 Mot de passe par défaut pour tous les utilisateurs : password123');
    console.log('📧 Emails créés : admin@ecsa.sn, formateur1@ecsa.sn, apprenant1@ecsa.sn, etc.');
  } catch (error) {
    console.error('❌ Erreur lors du seeding :', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();