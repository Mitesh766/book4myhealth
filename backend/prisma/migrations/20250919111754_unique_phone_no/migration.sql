/*
  Warnings:

  - A unique constraint covering the columns `[phoneNo]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Patient_phoneNo_key" ON "public"."Patient"("phoneNo");
