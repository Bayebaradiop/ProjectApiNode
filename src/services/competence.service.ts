import { PrismaClient } from '@prisma/client';
import { CompetenceInput, CompetenceUpdateInput } from '../validators/competence.validator';

const prisma = new PrismaClient();

export class CompetenceService {
  async getAllCompetences() {
    return await prisma.competence.findMany({
      include: {
        niveaux: {
          include: {
            niveau: true
          }
        },
        referentiels: {
          include: {
            referentiel: true
          }
        }
      },
      orderBy: {
        nom: 'asc'
      }
    });
  }

  async getCompetenceById(id: number) {
    return await prisma.competence.findUnique({
      where: { id },
      include: {
        niveaux: {
          include: {
            niveau: true
          }
        },
        referentiels: {
          include: {
            referentiel: true
          }
        }
      }
    });
  }

  async createCompetence(data: CompetenceInput) {
    return await prisma.competence.create({
      data,
      include: {
        niveaux: {
          include: {
            niveau: true
          }
        },
        referentiels: {
          include: {
            referentiel: true
          }
        }
      }
    });
  }

  async updateCompetence(id: number, data: CompetenceUpdateInput) {
    return await prisma.competence.update({
      where: { id },
      data,
      include: {
        niveaux: {
          include: {
            niveau: true
          }
        },
        referentiels: {
          include: {
            referentiel: true
          }
        }
      }
    });
  }

  async deleteCompetence(id: number) {
    await prisma.competence.delete({
      where: { id }
    });
  }
}
