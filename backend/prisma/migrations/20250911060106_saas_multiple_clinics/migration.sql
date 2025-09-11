/*
  Warnings:

  - The values [Scheduled,CheckedIn,Cancelled,Completed] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `Specialisation` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the `Queue` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clinicId,seq]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clinicId,customId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clinicId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `visitType` on the `Appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `clinicId` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialisation` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `Doctor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `clinicId` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seq` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."AdminRoles" AS ENUM ('Staff', 'Doctor', 'Owner');

-- CreateEnum
CREATE TYPE "public"."GenderType" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."VisitType" AS ENUM ('Appointment', 'Emergency', 'WalkIn');

-- CreateEnum
CREATE TYPE "public"."HistoryStatus" AS ENUM ('Completed', 'Cancelled');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."AppointmentStatus_new" AS ENUM ('SCHEDULED', 'CHECKED_IN', 'WITH_DOCTOR', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."Appointment" ALTER COLUMN "status" TYPE "public"."AppointmentStatus_new" USING ("status"::text::"public"."AppointmentStatus_new");
ALTER TYPE "public"."AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "public"."AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "public"."AppointmentStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Queue" DROP CONSTRAINT "Queue_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Queue" DROP CONSTRAINT "Queue_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Queue" DROP CONSTRAINT "Queue_patientId_fkey";

-- DropIndex
DROP INDEX "public"."Patient_customId_key";

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "clinicId" TEXT NOT NULL,
ADD COLUMN     "priority" INTEGER NOT NULL,
DROP COLUMN "visitType",
ADD COLUMN     "visitType" "public"."VisitType" NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "public"."Doctor" DROP COLUMN "Specialisation",
ADD COLUMN     "clinicId" TEXT NOT NULL,
ADD COLUMN     "specialisation" TEXT NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "public"."GenderType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "clinicId" TEXT NOT NULL,
ADD COLUMN     "seq" INTEGER NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "public"."GenderType" NOT NULL;

-- DropTable
DROP TABLE "public"."Queue";

-- DropEnum
DROP TYPE "public"."GenderTypes";

-- DropEnum
DROP TYPE "public"."PatientQueueStatus";

-- DropEnum
DROP TYPE "public"."PatientType";

-- DropEnum
DROP TYPE "public"."visitTypes";

-- CreateTable
CREATE TABLE "public"."Clinic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "patientIdPrefix" TEXT NOT NULL,
    "lastSeq" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNo" TEXT,
    "role" "public"."AdminRoles" NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AppointmentHistory" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "visitType" "public"."VisitType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "status" "public"."HistoryStatus" NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "withDoctorTime" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE INDEX "Appointment_clinicId_idx" ON "public"."Appointment"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_clinicId_seq_key" ON "public"."Patient"("clinicId", "seq");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_clinicId_customId_key" ON "public"."Patient"("clinicId", "customId");

-- AddForeignKey
ALTER TABLE "public"."Admin" ADD CONSTRAINT "Admin_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "public"."Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctor" ADD CONSTRAINT "Doctor_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "public"."Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Patient" ADD CONSTRAINT "Patient_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "public"."Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "public"."Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentHistory" ADD CONSTRAINT "AppointmentHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentHistory" ADD CONSTRAINT "AppointmentHistory_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentHistory" ADD CONSTRAINT "AppointmentHistory_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "public"."Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
