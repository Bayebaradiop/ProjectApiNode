import { PrismaClient, PromoFormateurs } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';

// Types locaux pour les données de création
interface PromoFormateurCreateData {
  promoId: number;
  userId: number;
}

export class PromoFormateurRepository extends BaseRepository implements IBaseRepository<PromoFormateurs, PromoFormateurCreateData, Partial<PromoFormateurCreateData>, { promoId: number; userId: number }> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(): Promise<PromoFormateurs[]> {
    return await this.prisma.promoFormateurs.findMany();
  }

  async findAllWithRelations(): Promise<PromoFormateurs[]> {
    return await this.prisma.promoFormateurs.findMany({
      include: {
        promo: true,
        user: true,
      },
    });
  }

  async findById(id: { promoId: number; userId: number }): Promise<PromoFormateurs | null> {
    return await this.prisma.promoFormateurs.findUnique({
      where: {
        promoId_userId: id
      }
    });
  }

  async findByIdWithRelations(id: { promoId: number; userId: number }): Promise<PromoFormateurs | null> {
    return await this.prisma.promoFormateurs.findUnique({
      where: {
        promoId_userId: id
      },
      include: {
        promo: true,
        user: true,
      },
    });
  }

  async create(data: PromoFormateurCreateData): Promise<PromoFormateurs> {
    // Vérifier si la promo existe
    const promo = await this.prisma.promo.findUnique({
      where: { id: data.promoId },
    });

    if (!promo) {
      throw new Error('Promo non trouvée');
    }

    // Vérifier si l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return await this.prisma.promoFormateurs.create({
      data
    });
  }

  async update(id: { promoId: number; userId: number }, data: Partial<PromoFormateurCreateData>): Promise<PromoFormateurs> {
    return await this.prisma.promoFormateurs.update({
      where: {
        promoId_userId: id
      },
      data
    });
  }

  async delete(id: { promoId: number; userId: number }): Promise<void> {
    await this.prisma.promoFormateurs.delete({
      where: {
        promoId_userId: id
      }
    });
  }

  async exists(id: { promoId: number; userId: number }): Promise<boolean> {
    const promoFormateur = await this.prisma.promoFormateurs.findUnique({
      where: {
        promoId_userId: id
      },
      select: { promoId: true, userId: true }
    });
    return !!promoFormateur;
  }

  async getFormateursByPromo(promoId: number) {
    // Vérifier si la promo existe
    const promo = await this.prisma.promo.findUnique({
      where: { id: promoId },
    });

    if (!promo) {
      throw new Error('Promo non trouvée');
    }

    // Récupérer les formateurs de la promo
    const formateurs = await this.prisma.promoFormateurs.findMany({
      where: { promoId },
      include: {
        user: {
          include: {
            profile: true,
            profilSortie: true,
            referentiel: true,
          }
        }
      }
    });

    return formateurs.map(pf => pf.user);
  }

  async getPromosByFormateur(userId: number) {
    // Vérifier si l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Récupérer les promos du formateur
    const promos = await this.prisma.promoFormateurs.findMany({
      where: { userId },
      include: {
        promo: {
          include: {
            formateurs: true,
          }
        }
      }
    });

    return promos.map(pf => pf.promo);
  }
}
