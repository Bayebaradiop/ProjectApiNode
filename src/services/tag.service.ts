import { PrismaClient } from '@prisma/client';
import { TagRepository } from '../repositories';
import { trieService } from './trie.service';


const prisma = new PrismaClient();
const tagRepository = new TagRepository(prisma);

export class TagService {
  async getAllTags() {
    return await tagRepository.findAll();
  }

  /** Récupère tous les tags avec tri dynamique */
  async getAllTagsTrieses(
    champTri?: string,
    ordre?: string,
    parametreMulti?: string
  ) {
    let ordrePrisma;
    const champsValides = ['nom', 'id', 'createdAt']; // Champs existants dans Tag

    if (parametreMulti) {
      // Tri multi-colonnes
      ordrePrisma = trieService.triMultiColonnes(champsValides, parametreMulti);
    } else {
      // Tri simple
      const champValide = trieService.validerChampTri(champsValides, champTri);
      const ordreValide = trieService.validerOrdre(ordre);
      ordrePrisma = [{ [champValide]: ordreValide }];
    }

    return await tagRepository.findAllWithRelationsTriees(ordrePrisma);
  }

  async getTagById(tagId: number) {
    return await tagRepository.findById(tagId);
  }

  async createTag(data: { nom: string }) {
    return await tagRepository.create(data);
  }

  async updateTag(tagId: number, data: { nom?: string }) {
    return await tagRepository.update(tagId, data);
  }

  async deleteTag(tagId: number) {
    await tagRepository.delete(tagId);
  }
}
