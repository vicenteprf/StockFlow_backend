/*
  Warnings:

  - A unique constraint covering the columns `[codigo,adminId]` on the table `Produto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome,adminId]` on the table `Produto` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Produto_codigo_key";

-- AlterTable
ALTER TABLE "Produto" ALTER COLUMN "codigo" DROP DEFAULT;
DROP SEQUENCE "Produto_codigo_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Produto_codigo_adminId_key" ON "Produto"("codigo", "adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_nome_adminId_key" ON "Produto"("nome", "adminId");
