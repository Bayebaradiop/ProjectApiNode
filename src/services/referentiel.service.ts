import { PrismaClient } from '@prisma/client';
import { ReferentielRepository, CompetenceRepository } from '../repositories';
import { trieService } from './trie.service';

const prisma = new PrismaClient();
const referentielRepository = new ReferentielRepository(prisma);
const competenceRepository = new CompetenceRepository(prisma);

export class ReferentielService {
  async getAllReferentiels() {
    return await referentielRepository.findAllWithRelations();
  }
  async getAllReferentielsTrieses(
    champTri?: string,
    ordre?: string,
    parametreMulti?: string
  ) {
    let ordrePrisma;

    if (parametreMulti) {
      // Tri multi-colonnes
      ordrePrisma = trieService.triMultiColonnes(['nom', 'id', 'createdAt'], parametreMulti);
    } else {
      // Tri simple
      const champValide = trieService.validerChampTri(['nom', 'id', 'createdAt'], champTri);
      const ordreValide = trieService.validerOrdre(ordre);
      ordrePrisma = [{ [champValide]: ordreValide }];
    }

    return await referentielRepository.findAllWithRelationsTriees(ordrePrisma);
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
