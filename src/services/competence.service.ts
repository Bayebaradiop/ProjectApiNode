// src/services/competence.service.ts
import { PrismaClient } from '@prisma/client';
import { CompetenceInput, CompetenceUpdateInput } from '../validators/competence.validator';
import { CompetenceRepository } from '../repositories';
import { trieService } from './trie.service';

const prisma = new PrismaClient();
const competenceRepository = new CompetenceRepository(prisma);

export class CompetenceService {
  /** Récupère toutes les compétences sans tri spécifique */
  async getAllCompetences() {
    return await competenceRepository.findAllWithRelations();
  }

  /** Récupère une compétence par son ID */
  async getCompetenceById(id: number) {
    return await competenceRepository.findByIdWithRelations(id);
  }

  /** Crée une nouvelle compétence */
  async createCompetence(data: CompetenceInput) {
    return await competenceRepository.create(data);
  }

  /** Met à jour une compétence existante */
  async updateCompetence(id: number, data: CompetenceUpdateInput) {
    return await competenceRepository.update(id, data);
  }

  /** Supprime une compétence */
  async deleteCompetence(id: number) {
    await competenceRepository.delete(id);
  }

  /**
   * Récupère toutes les compétences triées
   * @param champTri - Champ sur lequel trier ('nom', 'id', 'createdAt', ...)
   * @param ordre - 'asc' ou 'desc'
   * @param parametreMulti - Tri multi-colonnes ex: "nom:asc,createdAt:desc"
   */
  async getAllCompetencesTriees(
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

    return await competenceRepository.findAllWithRelationsTriees(ordrePrisma);
  }
}

export const competenceService = new CompetenceService();
