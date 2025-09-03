import { getAllTags } from './../controllers/tag.controller';
import { PrismaClient } from '@prisma/client';
import { TagRepository } from '../repositories';

const prisma = new PrismaClient();
const tagRepository = new TagRepository(prisma);

export class TagService {
  // async getAllTags() {
  //   return await tagRepository.findAll();
  // }

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

  async getAllTags(query?: any) {
  const { q } = query || {};

  if (q) {
    // Recherche avec filtre
    return await tagRepository.findAllWithSearch(q);
  }

  // Sinon retour normal
  return await tagRepository.findAllWithSearch();
}

}
