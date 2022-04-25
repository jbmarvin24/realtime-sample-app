/*
  Warnings:

  - You are about to drop the column `username` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `fromUsername` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postOwnerUsername` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "postId" INTEGER NOT NULL,
    "postOwnerUsername" TEXT NOT NULL,
    "fromUsername" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    CONSTRAINT "Notification_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Notification" ("createdAt", "id", "isRead", "postId", "updatedAt") SELECT "createdAt", "id", "isRead", "postId", "updatedAt" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
