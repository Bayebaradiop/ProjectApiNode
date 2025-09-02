import { PrismaClient } from '@prisma/client';
import { ReferentielRepository, CompetenceRepository } from '../repositories';

const prisma = new PrismaClient();
const referentielRepository = new ReferentielRepository(prisma);
const competenceRepository = new CompetenceRepository(prisma);

export class ReferentielService {
  async getAllReferentiels({ page, pageSize }: { page: number, pageSize: number }) {
    return await referentielRepository.findAllPaginated({ page, pageSize });
  }

  async getReferentielById(id: number) {
    return await referentielRepository.findByIdWithRelations(id);
  }

  async createReferentiel(data: { nom: string; description?: string }) {
    return await referentielRepository.create(data);
  }

  async updateReferentiel(id: number, data: { nom?: string; description?: string }) {
    return await referentielRepository.update(id, data);
  }

  async deleteReferentiel(id: number) {
    await referentielRepository.delete(id);
  }

  async addCompetenceToReferentiel(referentielId: number, competenceId: number) {
    return await referentielRepository.addCompetence(referentielId, competenceId);
  }

  async checkCompetenceExists(competenceId: number) {
    return await competenceRepository.exists(competenceId);
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
