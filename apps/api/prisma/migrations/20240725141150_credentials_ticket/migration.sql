-- AlterTable
ALTER TABLE `tickets` ADD COLUMN `credentials` VARCHAR(191) NOT NULL DEFAULT 'TEMPORARY_CREDENTIALS';
