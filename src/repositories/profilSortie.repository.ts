import { PrismaClient, ProfilSortie } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';

// Types locaux pour les données de création
interface ProfilSortieCreateData {
  nom: string;
}

export class ProfilSortieRepository extends BaseRepository implements IBaseRepository<ProfilSortie, ProfilSortieCreateData> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }


  async findAll(): Promise<ProfilSortie[]> {
    // Pour compatibilité interface, retourne tout sans pagination
    return await this.prisma.profilSortie.findMany();
  }

  async findAllPaginated({ page, pageSize }: { page: number, pageSize: number }) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const [data, total] = await Promise.all([
      this.prisma.profilSortie.findMany({
        skip,
        take,
        include: { users: true }
      }),
      this.prisma.profilSortie.count()
    ]);
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  async findAllWithRelations(): Promise<ProfilSortie[]> {
    return await this.prisma.profilSortie.findMany({
      include: {
        users: true,
      }
    });
  }

  async findById(id: number): Promise<ProfilSortie | null> {
    return await this.prisma.profilSortie.findUnique({
      where: { id }
    });
  }

  async findByIdWithRelations(id: number): Promise<ProfilSortie | null> {
    return await this.prisma.profilSortie.findUnique({
      where: { id },
      include: {
        users: true,
      }
    });
  }

  async create(data: ProfilSortieCreateData): Promise<ProfilSortie> {
    return await this.prisma.profilSortie.create({
      data,
      include: {
        users: true,
      }
    });
  }

  async update(id: number, data: Partial<ProfilSortieCreateData>): Promise<ProfilSortie> {
    return await this.prisma.profilSortie.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.profilSortie.delete({
      where: { id }
    });
  }

  async exists(id: number): Promise<boolean> {
    const profilSortie = await this.prisma.profilSortie.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!profilSortie;
  }
}
