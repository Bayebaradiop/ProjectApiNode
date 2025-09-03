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

  /** Liste simple, triée par nom asc */
  async findAll(): Promise<Competence[]> {
    return await this.prisma.competence.findMany({
      orderBy: { nom: 'asc' }
    });
  }

  /** Liste avec relations, triée par nom asc */
  async findAllWithRelations(): Promise<Competence[]> {
    return await this.prisma.competence.findMany({
      include: {
        niveaux: { include: { niveau: true } },
        referentiels: { include: { referentiel: true } }
      },
      orderBy: { nom: 'asc' }
    });
  }

  /**
   * Liste avec relations et tri dynamique
   * @param orderBy - tableau d'objets Prisma { champ: 'asc'|'desc' }
   */
  async findAllWithRelationsTriees(orderBy: Record<string, 'asc' | 'desc'>[]): Promise<Competence[]> {
    return await this.prisma.competence.findMany({
      include: {
        niveaux: { include: { niveau: true } },
        referentiels: { include: { referentiel: true } }
      },
      orderBy
    });
  }

  /** Récupère par ID simple */
  async findById(id: number): Promise<Competence | null> {
    return await this.prisma.competence.findUnique({ where: { id } });
  }

  /** Récupère par ID avec relations */
  async findByIdWithRelations(id: number): Promise<Competence | null> {
    return await this.prisma.competence.findUnique({
      where: { id },
      include: {
        niveaux: { include: { niveau: true } },
        referentiels: { include: { referentiel: true } }
      }
    });
  }

  /** Création */
  async create(data: CompetenceCreateData): Promise<Competence> {
    return await this.prisma.competence.create({
      data,
      include: {
        niveaux: { include: { niveau: true } },
        referentiels: { include: { referentiel: true } }
      }
    });
  }

  /** Mise à jour */
  async update(id: number, data: Partial<CompetenceCreateData>): Promise<Competence> {
    return await this.prisma.competence.update({
      where: { id },
      data
    });
  }

  /** Suppression */
  async delete(id: number): Promise<void> {
    await this.prisma.competence.delete({ where: { id } });
  }

  /** Vérifie l'existence */
  async exists(id: number): Promise<boolean> {
    const competence = await this.prisma.competence.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!competence;
  }
}
