/*
  Warnings:

  - You are about to drop the column `imageCloudUrl` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "imageCloudUrl",
ADD COLUMN     "image" TEXT;
