/*
  Warnings:

  - Added the required column `updatedAt` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "benefits" JSONB,
ADD COLUMN     "ctaText" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "features" JSONB,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "process" JSONB,
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
