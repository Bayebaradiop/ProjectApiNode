import { PrismaClient } from '@prisma/client';
import { NiveauInput, NiveauUpdateInput } from '../validators/niveau.validator';
import { NiveauRepository } from '../repositories';

const prisma = new PrismaClient();
const niveauRepository = new NiveauRepository(prisma);

export class NiveauService {
  async getAllNiveaux({ page, pageSize }: { page: number, pageSize: number }) {
    return await niveauRepository.findAllPaginated({ page, pageSize });
  }

  async getNiveauById(id: number) {
    return await niveauRepository.findByIdWithRelations(id);
  }

  async createNiveau(data: NiveauInput) {
    return await niveauRepository.create(data);
  }

  async updateNiveau(id: number, data: NiveauUpdateInput) {
    return await niveauRepository.update(id, data);
  }

  async deleteNiveau(id: number) {
    await niveauRepository.delete(id);
  }
}
