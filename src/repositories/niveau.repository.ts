import { PrismaClient, Niveau } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';

// Types locaux pour les données de création
interface NiveauCreateData {
  nom: string;
}

export class NiveauRepository extends BaseRepository implements IBaseRepository<Niveau, NiveauCreateData> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(): Promise<Niveau[]> {
    return await this.prisma.niveau.findMany({
      orderBy: {
        nom: 'asc'
      }
    });
  }

  async findAllWithRelations(): Promise<Niveau[]> {
    return await this.prisma.niveau.findMany({
      include: {
        competences: {
          include: {
            competence: {
              select: {
                id: true,
                nom: true
              }
            }
          }
        }
      },
      orderBy: {
        nom: 'asc'
      }
    });
  }

  async findById(id: number): Promise<Niveau | null> {
    return await this.prisma.niveau.findUnique({
      where: { id }
    });
  }

  async findByIdWithRelations(id: number): Promise<Niveau | null> {
    return await this.prisma.niveau.findUnique({
      where: { id },
      include: {
        competences: {
          include: {
            competence: {
              select: {
                id: true,
                nom: true
              }
            }
          }
        }
      }
    });
  }

  async create(data: NiveauCreateData): Promise<Niveau> {
    return await this.prisma.niveau.create({
      data,
      include: {
        competences: {
          include: {
            competence: {
              select: {
                id: true,
                nom: true
              }
            }
          }
        }
      }
    });
  }

  async update(id: number, data: Partial<NiveauCreateData>): Promise<Niveau> {
    return await this.prisma.niveau.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.niveau.delete({
      where: { id }
    });
  }

  async exists(id: number): Promise<boolean> {
    const niveau = await this.prisma.niveau.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!niveau;
  }
}
