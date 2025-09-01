import { PrismaClient, CompetenceNiveau } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';

// Types locaux pour les données de création
interface CompetenceNiveauCreateData {
  competenceId: number;
  niveauId: number;
}

export class CompetenceNiveauRepository extends BaseRepository implements IBaseRepository<CompetenceNiveau, CompetenceNiveauCreateData, Partial<CompetenceNiveauCreateData>, { competenceId: number; niveauId: number }> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(): Promise<CompetenceNiveau[]> {
    return await this.prisma.competenceNiveau.findMany();
  }

  async findAllWithRelations(): Promise<CompetenceNiveau[]> {
    return await this.prisma.competenceNiveau.findMany({
      include: {
        competence: true,
        niveau: true
      }
    });
  }

  async findById(id: { competenceId: number; niveauId: number }): Promise<CompetenceNiveau | null> {
    return await this.prisma.competenceNiveau.findUnique({
      where: {
        competenceId_niveauId: id
      }
    });
  }

  async findByIdWithRelations(id: { competenceId: number; niveauId: number }): Promise<CompetenceNiveau | null> {
    return await this.prisma.competenceNiveau.findUnique({
      where: {
        competenceId_niveauId: id
      },
      include: {
        competence: true,
        niveau: true
      }
    });
  }

  async create(data: CompetenceNiveauCreateData): Promise<CompetenceNiveau> {
    return await this.prisma.competenceNiveau.create({
      data
    });
  }

  async update(id: { competenceId: number; niveauId: number }, data: Partial<CompetenceNiveauCreateData>): Promise<CompetenceNiveau> {
    return await this.prisma.competenceNiveau.update({
      where: {
        competenceId_niveauId: id
      },
      data
    });
  }

  async delete(id: { competenceId: number; niveauId: number }): Promise<void> {
    await this.prisma.competenceNiveau.delete({
      where: {
        competenceId_niveauId: id
      }
    });
  }

  async exists(id: { competenceId: number; niveauId: number }): Promise<boolean> {
    const competenceNiveau = await this.prisma.competenceNiveau.findUnique({
      where: {
        competenceId_niveauId: id
      },
      select: { competenceId: true, niveauId: true }
    });
    return !!competenceNiveau;
  }

  async getNiveauxByCompetence(competenceId: number) {
    // Vérifier si la compétence existe
    const competence = await this.prisma.competence.findUnique({
      where: { id: competenceId },
      select: { id: true, nom: true }
    });

    if (!competence) {
      throw new Error('Compétence non trouvée');
    }

    // Récupérer les niveaux associés à la compétence
    const niveauxData = await this.prisma.competenceNiveau.findMany({
      where: { competenceId },
      include: {
        niveau: {
          select: {
            id: true,
            nom: true
          }
        }
      },
      orderBy: {
        niveau: {
          nom: 'asc'
        }
      }
    });

    // Formater les données
    return {
      competence: {
        id: competence.id,
        nom: competence.nom,
      },
      niveaux: niveauxData.map((item: any) => ({
        id: item.niveau.id,
        nom: item.niveau.nom,
        competenceNiveauId: item.competenceId,
      })),
      count: niveauxData.length,
    };
  }

  async getCompetencesByNiveau(niveauId: number) {
    // Vérifier si le niveau existe
    const niveau = await this.prisma.niveau.findUnique({
      where: { id: niveauId },
      select: { id: true, nom: true }
    });

    if (!niveau) {
      throw new Error('Niveau non trouvé');
    }

    // Récupérer les compétences associées au niveau
    const competencesData = await this.prisma.competenceNiveau.findMany({
      where: { niveauId },
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

    // Formater les données
    return {
      niveau: {
        id: niveau.id,
        nom: niveau.nom,
      },
      competences: competencesData.map((item: any) => ({
        id: item.competence.id,
        nom: item.competence.nom,
        description: item.competence.description,
        competenceNiveauId: item.niveauId,
      })),
      count: competencesData.length,
    };
  }
}
