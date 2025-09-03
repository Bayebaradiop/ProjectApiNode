import { PrismaClient } from '@prisma/client';
import { CompetenceInput, CompetenceUpdateInput } from '../validators/competence.validator';
import { CompetenceRepository } from '../repositories';

const prisma = new PrismaClient();
const competenceRepository = new CompetenceRepository(prisma);

export class CompetenceService {
  async getAllCompetences(query?: any) {
    const { q } = query || {};
    if (q) {
      return await competenceRepository.findAllWithSearch(q);
    }
    return await competenceRepository.findAllWithRelations();
  }

  async getCompetenceById(id: number) {
    return await competenceRepository.findByIdWithRelations(id);
  }

  async createCompetence(data: CompetenceInput) {
    return await competenceRepository.create(data);
  }

  async updateCompetence(id: number, data: CompetenceUpdateInput) {
    return await competenceRepository.update(id, data);
  }

  async deleteCompetence(id: number) {
    await competenceRepository.delete(id);
  }
}
