import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TagService {
  async getAllTags() {
    return await prisma.tag.findMany();
  }

  async getTagById(tagId: number) {
    return await prisma.tag.findUnique({ where: { id: tagId } });
  }

  async createTag(data: { nom: string }) {
    return await prisma.tag.create({
      data,
      select: { id: true, nom: true },
    });
  }

  async updateTag(tagId: number, data: { nom?: string }) {
    return await prisma.tag.update({
      where: { id: tagId },
      data,
      select: { id: true, nom: true },
    });
  }

  async deleteTag(tagId: number) {
    await prisma.tag.delete({ where: { id: tagId } });
  }
}
