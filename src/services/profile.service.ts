import { PrismaClient } from '@prisma/client';
import { CreateProfileInput, UpdateProfileInput } from '../validators/profile.validator';

const prisma = new PrismaClient();

export class ProfileService {
  async getAllProfiles() {
    return await prisma.profile.findMany({
      include: {
        users: true,
      }
    });
  }

  async getProfileById(profileId: number) {
    return await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        users: true,
      }
    });
  }

  async createProfile(data: CreateProfileInput) {
    const { nom } = data;

    return await prisma.profile.create({
      data: {
        nom,
      },
      include: {
        users: true,
      }
    });
  }

  async updateProfile(profileId: number, data: UpdateProfileInput) {
    const { nom } = data;

    return await prisma.profile.update({
      where: { id: profileId },
      data: {
        ...(nom && { nom }),
      },
      include: {
        users: true,
      }
    });
  }

  async deleteProfile(profileId: number) {
    await prisma.profile.delete({
      where: { id: profileId },
    });
  }
}
