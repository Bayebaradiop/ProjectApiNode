/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `profilSortieId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_profilSortieId_fkey`;

-- DropIndex
DROP INDEX `User_profilSortieId_fkey` ON `User`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `nom` VARCHAR(191) NULL,
    ADD COLUMN `prenom` VARCHAR(191) NULL,
    ADD COLUMN `telephone` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `profilSortieId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_profilSortieId_fkey` FOREIGN KEY (`profilSortieId`) REFERENCES `ProfilSortie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
