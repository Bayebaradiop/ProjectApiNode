import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReferentielCompetenceService {
  // Récupérer toutes les associations référentiel-compétence
  async getAllReferentielCompetences() {
    return await prisma.referentielCompetence.findMany({
      include: {
        referentiel: true,
        competence: true,
      },
    });
  }

  // Récupérer une association par ID
  async getReferentielCompetenceById(referentielId: number, competenceId: number) {
    const association = await prisma.referentielCompetence.findUnique({
      where: {
        referentielId_competenceId: {
          referentielId,
          competenceId,
        },
      },
      include: {
        referentiel: true,
        competence: true,
      },
    });

    if (!association) {
      throw new Error('Association référentiel-compétence non trouvée');
    }

    return association;
  }

  // Créer une nouvelle association
  async createReferentielCompetence(data: { referentielId: number; competenceId: number }) {
    // Vérifier que le référentiel existe
    const referentiel = await prisma.referentiel.findUnique({
      where: { id: data.referentielId },
    });

    if (!referentiel) {
      throw new Error('Référentiel non trouvé');
    }

    // Vérifier que la compétence existe
    const competence = await prisma.competence.findUnique({
      where: { id: data.competenceId },
    });

    if (!competence) {
      throw new Error('Compétence non trouvée');
    }

    // Vérifier que l'association n'existe pas déjà
    const existingAssociation = await prisma.referentielCompetence.findUnique({
      where: {
        referentielId_competenceId: {
          referentielId: data.referentielId,
          competenceId: data.competenceId,
        },
      },
    });

    if (existingAssociation) {
      throw new Error('Cette compétence est déjà associée à ce référentiel');
    }

    return await prisma.referentielCompetence.create({
      data,
      include: {
        referentiel: true,
        competence: true,
      },
    });
  }

  // Supprimer une association
  async deleteReferentielCompetence(referentielId: number, competenceId: number) {
    // Vérifier que l'association existe
    const association = await prisma.referentielCompetence.findUnique({
      where: {
        referentielId_competenceId: {
          referentielId,
          competenceId,
        },
      },
    });

    if (!association) {
      throw new Error('Association référentiel-compétence non trouvée');
    }

    return await prisma.referentielCompetence.delete({
      where: {
        referentielId_competenceId: {
          referentielId,
          competenceId,
        },
      },
      include: {
        referentiel: true,
        competence: true,
      },
    });
  }

  // Récupérer toutes les compétences d'un référentiel
  async getCompetencesByReferentiel(referentielId: number) {
    // Vérifier que le référentiel existe
    const referentiel = await prisma.referentiel.findUnique({
      where: { id: referentielId },
    });

    if (!referentiel) {
      throw new Error('Référentiel non trouvé');
    }

    return await prisma.referentielCompetence.findMany({
      where: { referentielId },
      include: {
        competence: true,
      },
    });
  }

  // Récupérer tous les référentiels d'une compétence
  async getReferentielsByCompetence(competenceId: number) {
    // Vérifier que la compétence existe
    const competence = await prisma.competence.findUnique({
      where: { id: competenceId },
    });

    if (!competence) {
      throw new Error('Compétence non trouvée');
    }

    return await prisma.referentielCompetence.findMany({
      where: { competenceId },
      include: {
        referentiel: true,
      },
    });
  }
}
