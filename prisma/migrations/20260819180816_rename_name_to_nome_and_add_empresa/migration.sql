/*
  Warnings:

  - You are about to drop the column `name` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable

ALTER TABLE "Usuario" RENAME COLUMN "name" TO "nome";

ALTER TABLE "Usuario" ADD COLUMN "empresa" TEXT;