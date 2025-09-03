import { PrismaClient, Promo } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';
import { buildSearchFilter } from "../services/recherche.service";


// Types locaux pour les données de création
interface PromoCreateData {
  nom: string;
  dateDebut: string | Date;
  dateFin: string | Date;
  referentielId?: number;
}

export class PromoRepository extends BaseRepository implements IBaseRepository<Promo, PromoCreateData> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(): Promise<Promo[]> {
    return await this.prisma.promo.findMany();
  }

  async findAllWithRelations(): Promise<any[]> {
    const promos = await this.prisma.promo.findMany({
      // include: { formateurs: true }
    });
    // Pour chaque promo, récupérer les référentiels associés via la table de jointure
    const promosWithReferentiels = await Promise.all(promos.map(async promo => {
      const referentiels = await this.prisma.promoReferentiel.findMany({
        where: { promoId: promo.id },
        // include: { referentiel: true }
      });
      // return { ...promo, referentiels: referentiels.map(r => r.referentiel) };
      return { ...promo };
    }));
    return promosWithReferentiels;
  }

  async findById(id: number): Promise<Promo | null> {
    return await this.prisma.promo.findUnique({
      where: { id }
    });
  }

  async findByIdWithRelations(id: number): Promise<any> {
    const promo = await this.prisma.promo.findUnique({
      where: { id },
      include: { formateurs: true }
    });
    if (!promo) {
      return null;
    }
    const referentiels = await this.prisma.promoReferentiel.findMany({
      where: { promoId: promo.id },
      include: { referentiel: true }
    });
    return { ...promo, referentiels: referentiels.map(r => r.referentiel) };
  }

  async create(data: PromoCreateData): Promise<Promo> {
    return await this.prisma.promo.create({
      data: {
        nom: data.nom,
        dateDebut: new Date(data.dateDebut),
        dateFin: new Date(data.dateFin),
      },
    });
  }

  async update(id: number, data: Partial<PromoCreateData>): Promise<Promo> {
    return await this.prisma.promo.update({
      where: { id },
      data: {
        nom: data.nom,
        dateDebut: data.dateDebut ? new Date(data.dateDebut) : undefined,
        dateFin: data.dateFin ? new Date(data.dateFin) : undefined,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.promo.delete({
      where: { id }
    });
  }

  async exists(id: number): Promise<boolean> {
    const promo = await this.prisma.promo.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!promo;
  }

  async findAllWithSearch(q?: string): Promise<Promo[]> {
    return await this.prisma.promo.findMany({
      where:buildSearchFilter(q, ["nom"]),
      // Ajoute ici les relations nécessaires
    });
  }

}
