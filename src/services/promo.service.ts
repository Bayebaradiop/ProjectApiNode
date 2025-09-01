import { PrismaClient } from '@prisma/client';
import { CreatePromoInput, UpdatePromoInput } from '../validators/promo.validator';

const prisma = new PrismaClient();

export class PromoService {
  async getAllPromos() {
    const promos = await prisma.promo.findMany({
      include: { formateurs: true }
    });
    // Pour chaque promo, récupérer les référentiels associés via la table de jointure
    const promosWithReferentiels = await Promise.all(promos.map(async promo => {
      const referentiels = await prisma.promoReferentiel.findMany({
        where: { promoId: promo.id },
        include: { referentiel: true }
      });
      return { ...promo, referentiels: referentiels.map(r => r.referentiel) };
    }));
    return promosWithReferentiels;
  }

  async getPromoById(id: number) {
    const promo = await prisma.promo.findUnique({
      where: { id },
      include: { formateurs: true }
    });
    if (!promo) {
      return null;
    }
    const referentiels = await prisma.promoReferentiel.findMany({
      where: { promoId: promo.id },
      include: { referentiel: true }
    });
    return { ...promo, referentiels: referentiels.map(r => r.referentiel) };
  }

  async createPromo(data: CreatePromoInput) {
    const { nom, dateDebut, dateFin } = data;
    return await prisma.promo.create({
      data: {
        nom,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
      },
    });
  }

  async updatePromo(id: number, data: UpdatePromoInput) {
    const { nom, dateDebut, dateFin } = data;
    return await prisma.promo.update({
      where: { id },
      data: {
        ...(nom && { nom }),
        ...(dateDebut && { dateDebut: new Date(dateDebut) }),
        ...(dateFin && { dateFin: new Date(dateFin) }),
      },
    });
  }

  async deletePromo(id: number) {
    // Supprimer d'abord les liens dans les tables de jointure
    await prisma.promoReferentiel.deleteMany({ where: { promoId: id } });
    await prisma.promoFormateurs.deleteMany({ where: { promoId: id } });

    // Puis supprimer la promo
    await prisma.promo.delete({ where: { id } });
  }
}
