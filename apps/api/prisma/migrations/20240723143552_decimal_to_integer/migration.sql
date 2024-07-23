/*
  Warnings:

  - You are about to alter the column `pointAmount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.

*/
-- AlterTable
ALTER TABLE `transactions` MODIFY `pointAmount` INTEGER NOT NULL;
