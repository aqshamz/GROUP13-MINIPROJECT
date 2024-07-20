/*
  Warnings:

  - Added the required column `picture` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `events` ADD COLUMN `picture` VARCHAR(191) NOT NULL,
    ADD COLUMN `thumbnail` VARCHAR(191) NOT NULL;
