/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patientIdPrefix]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNo]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Clinic_name_key" ON "public"."Clinic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_patientIdPrefix_key" ON "public"."Clinic"("patientIdPrefix");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_phoneNo_key" ON "public"."Clinic"("phoneNo");
