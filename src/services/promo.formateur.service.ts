import { PrismaClient } from '@prisma/client';
import { PromoIdParams, AddFormateurInput, RemoveFormateurParams } from '../validators/promo.validator';

const prisma = new PrismaClient();

export class PromoFormateurService {
  // GET /promos/:id/formateurs - Récupérer tous les formateurs d'une promo
  static async getFormateursByPromo(promoId: number, { page, pageSize }: { page: number, pageSize: number }) {
    // Vérifier si la promo existe
    const promo = await prisma.promo.findUnique({
      where: { id: promoId },
    });
    if (!promo) {
      throw new Error('Promo non trouvée');
    }
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const [formateurs, total] = await Promise.all([
      prisma.promoFormateurs.findMany({
        where: { promoId },
        include: {
          user: {
            include: {
              profile: true,
              profilSortie: true,
              referentiel: true,
            }
          }
        },
        skip,
        take
      }),
      prisma.promoFormateurs.count({ where: { promoId } })
    ]);
    return {
      data: formateurs.map(pf => pf.user),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  // POST /promos/:id/formateurs - Ajouter un formateur à une promo
  static async addFormateurToPromo(promoId: number, userId: number) {
    // Vérifier si la promo existe
    const promo = await prisma.promo.findUnique({
      where: { id: promoId },
    });

    if (!promo) {
      throw new Error('Promo non trouvée');
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier si l'utilisateur est déjà formateur de cette promo
    const existingRelation = await prisma.promoFormateurs.findUnique({
      where: {
        promoId_userId: {
          promoId,
          userId,
        }
      }
    });

    if (existingRelation) {
      throw new Error('Cet utilisateur est déjà formateur de cette promo');
    }

    // Ajouter le formateur à la promo
    const newRelation = await prisma.promoFormateurs.create({
      data: {
        promoId,
        userId,
      },
      include: {
        user: {
          include: {
            profile: true,
            profilSortie: true,
            referentiel: true,
          }
        },
        promo: true,
      }
    });

    return {
      promo: newRelation.promo,
      formateur: newRelation.user,
    };
  }

  // DELETE /promos/:id/formateurs/:userId - Supprimer un formateur d'une promo
  static async removeFormateurFromPromo(promoId: number, userId: number) {
    // Vérifier si la relation existe
    const existingRelation = await prisma.promoFormateurs.findUnique({
      where: {
        promoId_userId: {
          promoId,
          userId,
        }
      },
      include: {
        user: {
          include: {
            profile: true,
            profilSortie: true,
            referentiel: true,
          }
        },
        promo: true,
      }
    });

    if (!existingRelation) {
      throw new Error('Ce formateur n\'est pas associé à cette promo');
    }

    // Supprimer la relation
    await prisma.promoFormateurs.delete({
      where: {
        promoId_userId: {
          promoId,
          userId,
        }
      }
    });

    return {
      promo: existingRelation.promo,
      formateur: existingRelation.user,
    };
  }
}
