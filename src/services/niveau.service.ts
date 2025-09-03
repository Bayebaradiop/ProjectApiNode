import { PrismaClient } from '@prisma/client';
import { NiveauInput, NiveauUpdateInput } from '../validators/niveau.validator';
import { NiveauRepository } from '../repositories';

const prisma = new PrismaClient();
const niveauRepository = new NiveauRepository(prisma);

export class NiveauService {
  async getAllNiveaux(query?: any) {
    const { q } = query || {};
    if (q) {
      return await niveauRepository.findAllWithSearch(q);
    }
    return await niveauRepository.findAllWithRelations();
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
