import { PrismaClient } from '@prisma/client';
import { CreatePromoInput, UpdatePromoInput } from '../validators/promo.validator';
import { PromoRepository } from '../repositories';
import { trieService } from './trie.service';

const prisma = new PrismaClient();
const promoRepository = new PromoRepository(prisma);

export class PromoService {
  
  /** Récupère toutes les promos avec tri dynamique */
  async getAllPromosTrieses(
    champTri?: string,
    ordre?: string,
    parametreMulti?: string
  ) {
    let ordrePrisma;

    if (parametreMulti) {
      // Tri multi-colonnes
      ordrePrisma = trieService.triMultiColonnes(['nom', 'id', 'createdAt', 'annee'], parametreMulti);
    } else {
      // Tri simple
      const champValide = trieService.validerChampTri(['nom', 'id', 'createdAt', 'annee'], champTri);
      const ordreValide = trieService.validerOrdre(ordre);
      ordrePrisma = [{ [champValide]: ordreValide }];
    }

    return await promoRepository.findAllWithRelationsTriees(ordrePrisma);
  }

  async getAllPromos() {
    return await promoRepository.findAllWithRelations();
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


