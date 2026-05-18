-- Alter Session table for secure refresh token hashing
ALTER TABLE `sessions` CHANGE COLUMN `refreshToken` `refreshTokenHash` VARCHAR(128) NOT NULL;
ALTER TABLE `sessions` ADD COLUMN `revokedAt` DATETIME(3) NULL;
ALTER TABLE `sessions` ADD COLUMN `lastActiveAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
CREATE INDEX `sessions_expiresAt_idx` ON `sessions`(`expiresAt`);
