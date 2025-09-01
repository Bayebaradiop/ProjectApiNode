import { PrismaClient } from '@prisma/client';
import { CreateProfilSortieInput, UpdateProfilSortieInput } from '../validators/profilSortie.validator';

const prisma = new PrismaClient();

export class ProfilSortieService {
  async getAllProfilSorties() {
    return await prisma.profilSortie.findMany({
      include: {
        users: true,
      }
    });
  }

  async getProfilSortieById(profilSortieId: number) {
    return await prisma.profilSortie.findUnique({
      where: { id: profilSortieId },
      include: {
        users: true,
      }
    });
  }

  async createProfilSortie(data: CreateProfilSortieInput) {
    const { nom } = data;

    return await prisma.profilSortie.create({
      data: {
        nom,
      },
      include: {
        users: true,
      }
    });
  }

  async updateProfilSortie(profilSortieId: number, data: UpdateProfilSortieInput) {
    const { nom } = data;

    return await prisma.profilSortie.update({
      where: { id: profilSortieId },
      data: {
        ...(nom && { nom }),
      },
      include: {
        users: true,
      }
    });
  }

  async deleteProfilSortie(profilSortieId: number) {
    await prisma.profilSortie.delete({
      where: { id: profilSortieId },
    });
  }
}
