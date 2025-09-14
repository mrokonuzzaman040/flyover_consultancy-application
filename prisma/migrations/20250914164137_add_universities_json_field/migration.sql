/*
  Warnings:

  - The `universities` column on the `Destination` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Destination" DROP COLUMN "universities",
ADD COLUMN     "universities" JSONB;
