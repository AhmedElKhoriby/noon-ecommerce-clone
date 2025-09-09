/*
  Warnings:

  - You are about to drop the column `imagecloudUrl` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "imagecloudUrl",
ADD COLUMN     "imageCloudUrl" TEXT;
