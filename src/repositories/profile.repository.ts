import { PrismaClient, Profile } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';

// Types locaux pour les données de création
interface ProfileCreateData {
  nom: string;
  description?: string;
}

export class ProfileRepository extends BaseRepository implements IBaseRepository<Profile, ProfileCreateData> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(): Promise<Profile[]> {
    return await this.prisma.profile.findMany();
  }

  async findAllWithRelations(): Promise<Profile[]> {
    return await this.prisma.profile.findMany({
      include: {
        users: true,
      }
    });
  }

  async findAllPaginated({ page, pageSize }: { page: number, pageSize: number }) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const [data, total] = await Promise.all([
    this.prisma.profile.findMany({
      skip,
      take,
      include: { users: true }
    }),
    this.prisma.profile.count()
  ]);
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

  async findById(id: number): Promise<Profile | null> {
    return await this.prisma.profile.findUnique({
      where: { id }
    });
  }

  async findByIdWithRelations(id: number): Promise<Profile | null> {
    return await this.prisma.profile.findUnique({
      where: { id },
      include: {
        users: true,
      }
    });
  }

  async create(data: ProfileCreateData): Promise<Profile> {
    return await this.prisma.profile.create({
      data,
      include: {
        users: true,
      }
    });
  }

  async update(id: number, data: Partial<ProfileCreateData>): Promise<Profile> {
    return await this.prisma.profile.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.profile.delete({
      where: { id }
    });
  }

  async exists(id: number): Promise<boolean> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!profile;
  }
}
