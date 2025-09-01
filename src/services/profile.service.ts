import { PrismaClient } from '@prisma/client';
import { CreateProfileInput, UpdateProfileInput } from '../validators/profile.validator';
import { ProfileRepository } from '../repositories';

const prisma = new PrismaClient();
const profileRepository = new ProfileRepository(prisma);

export class ProfileService {
  async getAllProfiles() {
    return await profileRepository.findAllWithRelations();
  }

  async getProfileById(profileId: number) {
    return await profileRepository.findByIdWithRelations(profileId);
  }

  async createProfile(data: CreateProfileInput) {
    return await profileRepository.create(data);
  }

  async updateProfile(profileId: number, data: UpdateProfileInput) {
    return await profileRepository.update(profileId, data);
  }

  async deleteProfile(profileId: number) {
    await profileRepository.delete(profileId);
  }
}
