/*
  Warnings:

  - You are about to drop the column `preco` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `validade` on the `Produto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MovimentacaoEstoque" ADD COLUMN     "preco" DECIMAL(65,30),
ADD COLUMN     "validade" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "preco",
DROP COLUMN "quantidade",
DROP COLUMN "validade";
