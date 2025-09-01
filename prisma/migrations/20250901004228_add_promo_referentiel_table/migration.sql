/*
  Warnings:

  - You are about to drop the column `referentielId` on the `Promo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Promo` DROP FOREIGN KEY `Promo_referentielId_fkey`;

-- DropIndex
DROP INDEX `Promo_referentielId_fkey` ON `Promo`;

-- AlterTable
ALTER TABLE `Promo` DROP COLUMN `referentielId`;

-- CreateTable
CREATE TABLE `PromoReferentiel` (
    `promoId` INTEGER NOT NULL,
    `referentielId` INTEGER NOT NULL,

    PRIMARY KEY (`promoId`, `referentielId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PromoReferentiel` ADD CONSTRAINT `PromoReferentiel_promoId_fkey` FOREIGN KEY (`promoId`) REFERENCES `Promo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromoReferentiel` ADD CONSTRAINT `PromoReferentiel_referentielId_fkey` FOREIGN KEY (`referentielId`) REFERENCES `Referentiel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
