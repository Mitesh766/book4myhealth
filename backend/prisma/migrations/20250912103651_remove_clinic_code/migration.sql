/*
  Warnings:

  - You are about to drop the column `code` on the `Clinic` table. All the data in the column will be lost.
  - You are about to drop the column `clinicCode` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,clinicId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Clinic_code_key";

-- DropIndex
DROP INDEX "public"."User_email_clinicCode_key";

-- AlterTable
ALTER TABLE "public"."Clinic" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "clinicCode";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_clinicId_key" ON "public"."User"("email", "clinicId");
