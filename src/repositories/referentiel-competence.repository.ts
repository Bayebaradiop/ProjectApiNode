import { PrismaClient, ReferentielCompetence } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';

// Types locaux pour les données de création
interface ReferentielCompetenceCreateData {
  referentielId: number;
  competenceId: number;
}

export class ReferentielCompetenceRepository extends BaseRepository implements IBaseRepository<ReferentielCompetence, ReferentielCompetenceCreateData, Partial<ReferentielCompetenceCreateData>, { referentielId: number; competenceId: number }> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(): Promise<ReferentielCompetence[]> {
    return await this.prisma.referentielCompetence.findMany();
  }

  async findAllWithRelations(): Promise<ReferentielCompetence[]> {
    return await this.prisma.referentielCompetence.findMany({
      include: {
        referentiel: true,
        competence: true,
      },
    });
  }

  async findById(id: { referentielId: number; competenceId: number }): Promise<ReferentielCompetence | null> {
    return await this.prisma.referentielCompetence.findUnique({
      where: {
        referentielId_competenceId: id
      }
    });
  }

  async findByIdWithRelations(id: { referentielId: number; competenceId: number }): Promise<ReferentielCompetence | null> {
    return await this.prisma.referentielCompetence.findUnique({
      where: {
        referentielId_competenceId: id
      },
      include: {
        referentiel: true,
        competence: true,
      },
    });
  }

  async create(data: ReferentielCompetenceCreateData): Promise<ReferentielCompetence> {
    // Vérifier que le référentiel existe
    const referentiel = await this.prisma.referentiel.findUnique({
      where: { id: data.referentielId },
    });

    if (!referentiel) {
      throw new Error('Référentiel non trouvé');
    }

    // Vérifier que la compétence existe
    const competence = await this.prisma.competence.findUnique({
      where: { id: data.competenceId },
    });

    if (!competence) {
      throw new Error('Compétence non trouvée');
    }

    return await this.prisma.referentielCompetence.create({
      data
    });
  }

  async update(id: { referentielId: number; competenceId: number }, data: Partial<ReferentielCompetenceCreateData>): Promise<ReferentielCompetence> {
    return await this.prisma.referentielCompetence.update({
      where: {
        referentielId_competenceId: id
      },
      data
    });
  }

  async delete(id: { referentielId: number; competenceId: number }): Promise<void> {
    await this.prisma.referentielCompetence.delete({
      where: {
        referentielId_competenceId: id
      }
    });
  }

  async exists(id: { referentielId: number; competenceId: number }): Promise<boolean> {
    const referentielCompetence = await this.prisma.referentielCompetence.findUnique({
      where: {
        referentielId_competenceId: id
      },
      select: { referentielId: true, competenceId: true }
    });
    return !!referentielCompetence;
  }

  async getCompetencesByReferentiel(referentielId: number) {
    const referentiel = await this.prisma.referentiel.findUnique({
      where: { id: referentielId },
      select: { id: true, nom: true }
    });

    if (!referentiel) {
      throw new Error('Référentiel non trouvé');
    }

    const competencesData = await this.prisma.referentielCompetence.findMany({
      where: { referentielId },
      include: {
        competence: {
          select: {
            id: true,
            nom: true,
            description: true
          }
        }
      },
      orderBy: {
        competence: {
          nom: 'asc'
        }
      }
    });

    return {
      referentiel: {
        id: referentiel.id,
        nom: referentiel.nom,
      },
      competences: competencesData.map((item: any) => ({
        id: item.competence.id,
        nom: item.competence.nom,
        description: item.competence.description,
      })),
      count: competencesData.length,
    };
  }

  async getReferentielsByCompetence(competenceId: number) {
    const competence = await this.prisma.competence.findUnique({
      where: { id: competenceId },
      select: { id: true, nom: true }
    });

    if (!competence) {
      throw new Error('Compétence non trouvée');
    }

    const referentielsData = await this.prisma.referentielCompetence.findMany({
      where: { competenceId },
      include: {
        referentiel: {
          select: {
            id: true,
            nom: true,
            description: true
          }
        }
      },
      orderBy: {
        referentiel: {
          nom: 'asc'
        }
      }
    });

    return {
      competence: {
        id: competence.id,
        nom: competence.nom,
      },
      referentiels: referentielsData.map((item: any) => ({
        id: item.referentiel.id,
        nom: item.referentiel.nom,
        description: item.referentiel.description,
      })),
      count: referentielsData.length,
    };
  }
}
