/*
  Warnings:

  - You are about to drop the column `price` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `ticketType` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `rating` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketAmount` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comments` ADD COLUMN `rating` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `tickets` DROP COLUMN `price`,
    DROP COLUMN `status`,
    DROP COLUMN `ticketType`;

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `ticketAmount` INTEGER NOT NULL;
