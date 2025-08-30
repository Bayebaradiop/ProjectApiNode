/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Competence` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom]` on the table `Niveau` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom]` on the table `ProfilSortie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom]` on the table `Promo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom]` on the table `Referentiel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Competence_nom_key` ON `Competence`(`nom`);

-- CreateIndex
CREATE UNIQUE INDEX `Niveau_nom_key` ON `Niveau`(`nom`);

-- CreateIndex
CREATE UNIQUE INDEX `ProfilSortie_nom_key` ON `ProfilSortie`(`nom`);

-- CreateIndex
CREATE UNIQUE INDEX `Promo_nom_key` ON `Promo`(`nom`);

-- CreateIndex
CREATE UNIQUE INDEX `Referentiel_nom_key` ON `Referentiel`(`nom`);
