import { PrismaClient } from '@prisma/client';
import { CreatePromoInput, UpdatePromoInput } from '../validators/promo.validator';
import { PromoRepository } from '../repositories';

const prisma = new PrismaClient();
const promoRepository = new PromoRepository(prisma);

export class PromoService {
  async getAllPromos({ page, pageSize }: { page: number, pageSize: number }) {
    return await promoRepository.findAllPaginated({ page, pageSize });
  }

  async getPromoById(id: number) {
    return await promoRepository.findByIdWithRelations(id);
  }

  async createPromo(data: CreatePromoInput) {
    return await promoRepository.create(data);
  }

  async updatePromo(id: number, data: UpdatePromoInput) {
    return await promoRepository.update(id, data);
  }

  async deletePromo(id: number) {
    // Supprimer d'abord les liens dans les tables de jointure
    await prisma.promoReferentiel.deleteMany({ where: { promoId: id } });
    await prisma.promoFormateurs.deleteMany({ where: { promoId: id } });

    // Puis supprimer la promo
    await promoRepository.delete(id);
  }
}


