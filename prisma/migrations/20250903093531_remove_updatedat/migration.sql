/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_profilSortieId_fkey`;

-- DropIndex
DROP INDEX `User_profilSortieId_fkey` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `createdAt`,
    DROP COLUMN `nom`,
    DROP COLUMN `prenom`,
    DROP COLUMN `telephone`,
    DROP COLUMN `updatedAt`,
    MODIFY `profilSortieId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_profilSortieId_fkey` FOREIGN KEY (`profilSortieId`) REFERENCES `ProfilSortie`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
