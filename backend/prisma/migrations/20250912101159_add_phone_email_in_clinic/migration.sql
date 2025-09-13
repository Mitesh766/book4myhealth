/*
  Warnings:

  - Added the required column `email` to the `Clinic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNo` to the `Clinic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Clinic" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phoneNo" TEXT NOT NULL;
