/*
  Warnings:

  - A unique constraint covering the columns `[email,clinicId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_email_clinicId_key" ON "public"."User"("email", "clinicId");
