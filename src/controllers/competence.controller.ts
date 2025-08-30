import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CompetenceController {
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const competences = await prisma.competence.findMany({
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

      return res.json({
        success: true,
        message: 'Compétences récupérées avec succès',
        data: competences,
        count: competences.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des compétences:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des compétences',
        error: (error as Error).message
      });
    }
  }
}

// Instance du contrôleur
export const competenceController = new CompetenceController();
