import { PrismaClient } from '@prisma/client';
import { NiveauInput, NiveauUpdateInput } from '../validators/niveau.validator';

const prisma = new PrismaClient();

export class NiveauService {
  async getAllNiveaux() {
    return await prisma.niveau.findMany({
      include: {
        competences: {
          include: {
            competence: {
              select: {
                id: true,
                nom: true
              }
            }
          }
        }
      },
      orderBy: {
        nom: 'asc'
      }
    });
  }

  async getNiveauById(id: number) {
    return await prisma.niveau.findUnique({
      where: { id },
      include: {
        competences: {
          include: {
            competence: {
              select: {
                id: true,
                nom: true
              }
            }
          }
        }
      }
    });
  }

  async createNiveau(data: NiveauInput) {
    return await prisma.niveau.create({
      data,
      include: {
        competences: {
          include: {
            competence: {
              select: {
                id: true,
                nom: true
              }
            }
          }
        }
      }
    });
  }

  async updateNiveau(id: number, data: NiveauUpdateInput) {
    return await prisma.niveau.update({
      where: { id },
      data,
      include: {
        competences: {
          include: {
            competence: {
              select: {
                id: true,
                nom: true
              }
            }
          }
        }
      }
    });
  }

  async deleteNiveau(id: number) {
    await prisma.niveau.delete({
      where: { id }
    });
  }
}
