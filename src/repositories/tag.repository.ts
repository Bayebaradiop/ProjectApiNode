import { PrismaClient, Tag } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';

// Types locaux pour les données de création
interface TagCreateData {
  nom: string;
}

export class TagRepository extends BaseRepository implements IBaseRepository<Tag, TagCreateData> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }
    /** Liste avec tri dynamique */
  async findAllWithRelationsTriees(orderBy: Record<string, 'asc' | 'desc'>[]): Promise<Tag[]> {
    return await this.prisma.tag.findMany({
      orderBy,
    });
  }

  async findAll(): Promise<Tag[]> {
    return await this.prisma.tag.findMany();
  }

  async findById(id: number): Promise<Tag | null> {
    return await this.prisma.tag.findUnique({
      where: { id }
    });
  }

  async create(data: TagCreateData): Promise<Tag> {
    return await this.prisma.tag.create({
      data,
      select: { id: true, nom: true }
    });
  }

  async update(id: number, data: Partial<TagCreateData>): Promise<Tag> {
    return await this.prisma.tag.update({
      where: { id },
      data,
      select: { id: true, nom: true }
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.tag.delete({
      where: { id }
    });
  }

  async exists(id: number): Promise<boolean> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!tag;
  }
}
