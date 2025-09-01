import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReferentielService {
  async getAllReferentiels() {
    return await prisma.referentiel.findMany({
      include: {
        competences: true,
        users: true,
        promos: true
      }
    });
  }

  async getReferentielById(id: number) {
    return await prisma.referentiel.findUnique({
      where: { id },
      include: {
        competences: true,
        users: true,
        promos: true
      }
    });
  }

  async createReferentiel(data: { nom: string; description?: string }) {
    return await prisma.referentiel.create({
      data
    });
  }

  async updateReferentiel(id: number, data: { nom?: string; description?: string }) {
    return await prisma.referentiel.update({
      where: { id },
      data
    });
  }

  async deleteReferentiel(id: number) {
    await prisma.referentiel.delete({ where: { id } });
  }

  async addCompetenceToReferentiel(referentielId: number, competenceId: number) {
    return await prisma.referentielCompetence.create({
      data: {
        referentielId,
        competenceId
      },
      include: {
        competence: true,
        referentiel: true
      }
    });
  }

  async checkCompetenceExists(competenceId: number) {
    return await prisma.competence.findUnique({
      where: { id: competenceId }
    });
  }

  async checkReferentielCompetenceExists(referentielId: number, competenceId: number) {
    return await prisma.referentielCompetence.findUnique({
      where: {
        referentielId_competenceId: {
          referentielId,
          competenceId
        }
      }
    });
  }
}
