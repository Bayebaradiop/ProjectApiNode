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


  async findAll(): Promise<Tag[]> {
    // Pour compatibilité interface, retourne tout sans pagination
    return await this.prisma.tag.findMany();
  }

  async findAllPaginated({ page, pageSize }: { page: number, pageSize: number }) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const [data, total] = await Promise.all([
      this.prisma.tag.findMany({ skip, take }),
      this.prisma.tag.count()
    ]);
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
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
