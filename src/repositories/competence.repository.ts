import { PrismaClient, Competence } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';

// Types locaux pour les données de création
interface CompetenceCreateData {
  nom: string;
  description?: string;
}

export class CompetenceRepository extends BaseRepository implements IBaseRepository<Competence, CompetenceCreateData> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(): Promise<Competence[]> {
    return await this.prisma.competence.findMany({
      orderBy: {
        nom: 'asc'
      }
    });
  }

  async findAllWithRelations(): Promise<Competence[]> {
    return await this.prisma.competence.findMany({
      include: {
        niveaux: {
          include: {
            niveau: true
          }
        },
        referentiels: {
          include: {
            referentiel: true
          }
        }
      },
      orderBy: {
        nom: 'asc'
      }
    });
  }

  async findById(id: number): Promise<Competence | null> {
    return await this.prisma.competence.findUnique({
      where: { id }
    });
  }

  async findByIdWithRelations(id: number): Promise<Competence | null> {
    return await this.prisma.competence.findUnique({
      where: { id },
      include: {
        niveaux: {
          include: {
            niveau: true
          }
        },
        referentiels: {
          include: {
            referentiel: true
          }
        }
      }
    });
  }

  async create(data: CompetenceCreateData): Promise<Competence> {
    return await this.prisma.competence.create({
      data,
      include: {
        niveaux: {
          include: {
            niveau: true
          }
        },
        referentiels: {
          include: {
            referentiel: true
          }
        }
      }
    });
  }

  async update(id: number, data: Partial<CompetenceCreateData>): Promise<Competence> {
    return await this.prisma.competence.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.competence.delete({
      where: { id }
    });
  }

  async exists(id: number): Promise<boolean> {
    const competence = await this.prisma.competence.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!competence;
  }
}
