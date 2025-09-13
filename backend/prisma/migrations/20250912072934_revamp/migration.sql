/*
  Warnings:

  - The values [MALE,FEMALE,OTHER] on the enum `GenderType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `priority` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNo` on the `Clinic` table. All the data in the column will be lost.
  - You are about to drop the column `clinicId` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNo` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `seq` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the `AppointmentHistory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,clinicCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Clinic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `refreshToken` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clinicId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."GenderType_new" AS ENUM ('Male', 'Female', 'Other');
ALTER TABLE "public"."Doctor" ALTER COLUMN "gender" TYPE "public"."GenderType_new" USING ("gender"::text::"public"."GenderType_new");
ALTER TABLE "public"."Patient" ALTER COLUMN "gender" TYPE "public"."GenderType_new" USING ("gender"::text::"public"."GenderType_new");
ALTER TYPE "public"."GenderType" RENAME TO "GenderType_old";
ALTER TYPE "public"."GenderType_new" RENAME TO "GenderType";
DROP TYPE "public"."GenderType_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."UserRole" ADD VALUE 'doctor';
ALTER TYPE "public"."UserRole" ADD VALUE 'staff';

-- DropForeignKey
ALTER TABLE "public"."AppointmentHistory" DROP CONSTRAINT "AppointmentHistory_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AppointmentHistory" DROP CONSTRAINT "AppointmentHistory_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AppointmentHistory" DROP CONSTRAINT "AppointmentHistory_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Doctor" DROP CONSTRAINT "Doctor_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_clinicId_fkey";

-- DropIndex
DROP INDEX "public"."Appointment_clinicId_idx";

-- DropIndex
DROP INDEX "public"."Appointment_doctorId_idx";

-- DropIndex
DROP INDEX "public"."Appointment_patientId_idx";

-- DropIndex
DROP INDEX "public"."Clinic_name_key";

-- DropIndex
DROP INDEX "public"."Clinic_phoneNo_key";

-- DropIndex
DROP INDEX "public"."Patient_clinicId_seq_key";

-- DropIndex
DROP INDEX "public"."User_email_clinicId_key";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "priority",
DROP COLUMN "updatedAt",
ADD COLUMN     "cancelTime" TIMESTAMP(3),
ADD COLUMN     "completeTime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Clinic" DROP COLUMN "phoneNo",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Doctor" DROP COLUMN "clinicId",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phoneNo",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "overrideAvailability" DROP NOT NULL,
ALTER COLUMN "avgTimePerPatient" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Patient" DROP COLUMN "seq";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "clinicCode" TEXT NOT NULL,
ALTER COLUMN "refreshToken" SET NOT NULL,
ALTER COLUMN "clinicId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."AppointmentHistory";

-- DropEnum
DROP TYPE "public"."HistoryStatus";

-- CreateTable
CREATE TABLE "public"."Prescription" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "vitals" JSONB,
    "symptoms" TEXT,
    "diagnosis" TEXT,
    "medications" JSONB,
    "tests" JSONB,
    "advice" TEXT,
    "followUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Report" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prescription_appointmentId_idx" ON "public"."Prescription"("appointmentId");

-- CreateIndex
CREATE INDEX "Report_patientId_idx" ON "public"."Report"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_clinicId_patientId_doctorId_idx" ON "public"."Appointment"("clinicId", "patientId", "doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_code_key" ON "public"."Clinic"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_userId_key" ON "public"."Doctor"("userId");

-- CreateIndex
CREATE INDEX "Doctor_userId_idx" ON "public"."Doctor"("userId");

-- CreateIndex
CREATE INDEX "Patient_clinicId_idx" ON "public"."Patient"("clinicId");

-- CreateIndex
CREATE INDEX "User_clinicId_idx" ON "public"."User"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_clinicCode_key" ON "public"."User"("email", "clinicCode");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "public"."Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prescription" ADD CONSTRAINT "Prescription_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
