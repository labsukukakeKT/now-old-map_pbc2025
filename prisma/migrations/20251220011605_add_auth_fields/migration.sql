/*
  Warnings:

  - You are about to drop the column `lattitude` on the `place_DB` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `place_DB` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `user_DB` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lat` to the `place_DB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `place_DB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `user_DB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `user_DB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_DB` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "place_DB" DROP COLUMN "lattitude",
DROP COLUMN "longitude",
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "user_DB" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_DB_email_key" ON "user_DB"("email");
