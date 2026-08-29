/*
  Warnings:

  - A unique constraint covering the columns `[nome,adminId]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `Categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizado` to the `Categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminId` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "adminId" INTEGER NOT NULL,
ADD COLUMN     "atualizado" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "adminId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_adminId_key" ON "Categoria"("nome", "adminId");

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
