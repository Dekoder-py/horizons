/*
  Warnings:

  - The values [personal_website,platformer_game,website,game,terminal_cli,desktop_app,mobile_app,wildcard] on the enum `ProjectType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProjectType_new" AS ENUM ('windows_playable', 'mac_playable', 'linux_playable', 'web_playable', 'cross_platform_playable');
ALTER TABLE "projects" ALTER COLUMN "project_type" TYPE "ProjectType_new" USING ("project_type"::text::"ProjectType_new");
ALTER TYPE "ProjectType" RENAME TO "ProjectType_old";
ALTER TYPE "ProjectType_new" RENAME TO "ProjectType";
DROP TYPE "public"."ProjectType_old";
COMMIT;
