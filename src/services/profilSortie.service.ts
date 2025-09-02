import { PrismaClient } from '@prisma/client';
import { CreateProfilSortieInput, UpdateProfilSortieInput } from '../validators/profilSortie.validator';
import { ProfilSortieRepository } from '../repositories';

const prisma = new PrismaClient();
const profilSortieRepository = new ProfilSortieRepository(prisma);

export class ProfilSortieService {
  async getAllProfilSorties({ page, pageSize }: { page: number, pageSize: number }) {
    return await profilSortieRepository.findAllPaginated({ page, pageSize });
  }

  async getProfilSortieById(profilSortieId: number) {
    return await profilSortieRepository.findByIdWithRelations(profilSortieId);
  }

  async createProfilSortie(data: CreateProfilSortieInput) {
    return await profilSortieRepository.create(data);
  }

  async updateProfilSortie(profilSortieId: number, data: UpdateProfilSortieInput) {
    return await profilSortieRepository.update(profilSortieId, data);
  }

  async deleteProfilSortie(profilSortieId: number) {
    await profilSortieRepository.delete(profilSortieId);
  }
}
