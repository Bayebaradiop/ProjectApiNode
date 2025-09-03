import { PrismaClient, Referentiel } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';

// Types locaux pour les données de création
interface ReferentielCreateData {
  nom: string;
  description?: string;
}

export class ReferentielRepository extends BaseRepository implements IBaseRepository<Referentiel, ReferentielCreateData> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(): Promise<Referentiel[]> {
    return await this.prisma.referentiel.findMany();
  }
   /**
 * Liste des référentiels avec relations et tri dynamique
 * @param orderBy - tableau d'objets Prisma { champ: 'asc'|'desc' }
 */
async findAllWithRelationsTriees(orderBy: Record<string, 'asc' | 'desc'>[]): Promise<Referentiel[]> {
  return await this.prisma.referentiel.findMany({
    include: {
      competences: true,
      users: true,
      promos: true
    },
    orderBy
  });
}

  async findAllWithRelations(): Promise<Referentiel[]> {
    return await this.prisma.referentiel.findMany({
      include: {
        competences: true,
        users: true,
        promos: true
      }
    });
  }

  async findById(id: number): Promise<Referentiel | null> {
    return await this.prisma.referentiel.findUnique({
      where: { id }
    });
  }

  async findByIdWithRelations(id: number): Promise<Referentiel | null> {
    return await this.prisma.referentiel.findUnique({
      where: { id },
      include: {
        competences: true,
        users: true,
        promos: true
      }
    });
  }

  async create(data: ReferentielCreateData): Promise<Referentiel> {
    return await this.prisma.referentiel.create({
      data
    });
  }

  async update(id: number, data: Partial<ReferentielCreateData>): Promise<Referentiel> {
    return await this.prisma.referentiel.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.referentiel.delete({
      where: { id }
    });
  }

  async exists(id: number): Promise<boolean> {
    const referentiel = await this.prisma.referentiel.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!referentiel;
  }

  async addCompetence(referentielId: number, competenceId: number) {
    return await this.prisma.referentielCompetence.create({
      data: {
        referentielId,
        competenceId
      },
      include: {
        competence: true
      }
    });
  }

  async removeCompetence(referentielId: number, competenceId: number) {
    return await this.prisma.referentielCompetence.delete({
      where: {
        referentielId_competenceId: {
          referentielId,
          competenceId
        }
      }
    });
  }
}
