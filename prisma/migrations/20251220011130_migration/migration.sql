/*
  Warnings:

  - You are about to drop the column `lattitude` on the `place_DB` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `place_DB` table. All the data in the column will be lost.
  - Added the required column `lat` to the `place_DB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `place_DB` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "place_DB" DROP COLUMN "lattitude",
DROP COLUMN "longitude",
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;
