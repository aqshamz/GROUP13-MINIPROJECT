/*
  Warnings:

  - You are about to drop the `statistics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `statistics` DROP FOREIGN KEY `statistics_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `statistics` DROP FOREIGN KEY `statistics_organizerId_fkey`;

-- DropTable
DROP TABLE `statistics`;
