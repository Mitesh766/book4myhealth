/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `Queue` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "withDoctorTime" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "public"."Appointment"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_idx" ON "public"."Appointment"("doctorId");

-- CreateIndex
CREATE INDEX "Queue_appointmentId_idx" ON "public"."Queue"("appointmentId");

-- CreateIndex
CREATE INDEX "Queue_patientId_idx" ON "public"."Queue"("patientId");

-- CreateIndex
CREATE INDEX "Queue_doctorId_idx" ON "public"."Queue"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_patientId_key" ON "public"."Queue"("patientId");
