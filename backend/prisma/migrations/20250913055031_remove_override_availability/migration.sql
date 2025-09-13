/*
  Warnings:

  - You are about to drop the column `defaultAvailability` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `overrideAvailability` on the `Doctor` table. All the data in the column will be lost.
  - Added the required column `availability` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Doctor" DROP COLUMN "defaultAvailability",
DROP COLUMN "overrideAvailability",
ADD COLUMN     "availability" JSONB NOT NULL;
