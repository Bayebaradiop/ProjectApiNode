import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CompetenceNiveauService {
  // GET /competences/:id/niveaux - Récupérer les niveaux d'une compétence
  static async getNiveauxByCompetence(competenceId: number) {
    // Vérifier si la compétence existe
    const competence = await prisma.competence.findUnique({
      where: { id: competenceId },
      select: { id: true, nom: true }
    });

    if (!competence) {
      throw new Error('Compétence non trouvée');
    }

    // Récupérer les niveaux associés à la compétence
    const niveauxData = await prisma.competenceNiveau.findMany({
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

  // POST /competences/:id/niveaux - Ajouter un niveau à une compétence
  static async addNiveauToCompetence(competenceId: number, niveauId: number) {
    // Vérifier si la compétence existe
    const competence = await prisma.competence.findUnique({
      where: { id: competenceId },
      select: { id: true, nom: true }
    });

    if (!competence) {
      throw new Error('Compétence non trouvée');
    }

    // Vérifier si le niveau existe
    const niveau = await prisma.niveau.findUnique({
      where: { id: niveauId },
      select: { id: true, nom: true }
    });

    if (!niveau) {
      throw new Error('Niveau non trouvé');
    }

    // Vérifier si la relation existe déjà
    const existingRelation = await prisma.competenceNiveau.findUnique({
      where: {
        competenceId_niveauId: {
          competenceId,
          niveauId
        }
      }
    });

    if (existingRelation) {
      throw new Error('Cette compétence est déjà associée à ce niveau');
    }

    // Créer la relation
    const competenceNiveau = await prisma.competenceNiveau.create({
      data: {
        competenceId,
        niveauId
      },
      include: {
        competence: {
          select: { id: true, nom: true }
        },
        niveau: {
          select: { id: true, nom: true }
        }
      }
    });

    return {
      competence: competenceNiveau.competence,
      niveau: competenceNiveau.niveau,
      competenceNiveauId: competenceNiveau.competenceId
    };
  }

  // PUT /competences/:competenceId/niveaux/:niveauId - Modifier la relation compétence-niveau
  static async updateCompetenceNiveau(competenceId: number, niveauId: number, newNiveauId: number) {
    // Vérifier si la relation actuelle existe
    const existingRelation = await prisma.competenceNiveau.findUnique({
      where: {
        competenceId_niveauId: {
          competenceId,
          niveauId
        }
      }
    });

    if (!existingRelation) {
      throw new Error('Relation compétence-niveau non trouvée');
    }

    // Vérifier si le nouveau niveau existe
    const newNiveau = await prisma.niveau.findUnique({
      where: { id: newNiveauId },
      select: { id: true, nom: true }
    });

    if (!newNiveau) {
      throw new Error('Nouveau niveau non trouvé');
    }

    // Vérifier si la nouvelle relation existe déjà
    if (newNiveauId !== niveauId) {
      const newRelationExists = await prisma.competenceNiveau.findUnique({
        where: {
          competenceId_niveauId: {
            competenceId,
            niveauId: newNiveauId
          }
        }
      });

      if (newRelationExists) {
        throw new Error('Cette compétence est déjà associée au nouveau niveau');
      }
    }

    // Supprimer l'ancienne relation et créer la nouvelle
    await prisma.competenceNiveau.delete({
      where: {
        competenceId_niveauId: {
          competenceId,
          niveauId
        }
      }
    });

    const newCompetenceNiveau = await prisma.competenceNiveau.create({
      data: {
        competenceId,
        niveauId: newNiveauId
      },
      include: {
        competence: {
          select: { id: true, nom: true }
        },
        niveau: {
          select: { id: true, nom: true }
        }
      }
    });

    return {
      competence: newCompetenceNiveau.competence,
      niveau: newCompetenceNiveau.niveau,
      competenceNiveauId: newCompetenceNiveau.competenceId
    };
  }

  // DELETE /competences/:competenceId/niveaux/:niveauId - Supprimer un niveau d'une compétence
  static async removeNiveauFromCompetence(competenceId: number, niveauId: number) {
    // Vérifier si la relation existe
    const existingRelation = await prisma.competenceNiveau.findUnique({
      where: {
        competenceId_niveauId: {
          competenceId,
          niveauId
        }
      },
      include: {
        competence: {
          select: { id: true, nom: true }
        },
        niveau: {
          select: { id: true, nom: true }
        }
      }
    });

    if (!existingRelation) {
      throw new Error('Relation compétence-niveau non trouvée');
    }

    // Supprimer la relation
    await prisma.competenceNiveau.delete({
      where: {
        competenceId_niveauId: {
          competenceId,
          niveauId
        }
      }
    });

    return {
      competence: existingRelation.competence,
      niveau: existingRelation.niveau,
      competenceNiveauId: existingRelation.competenceId
    };
  }
}
