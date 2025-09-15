-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
