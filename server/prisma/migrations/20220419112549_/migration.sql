/*
  Warnings:

  - Added the required column `message` to the `Notification` table without a default value. This is not possible if the table is not empty.

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
    "message" TEXT NOT NULL,
    CONSTRAINT "Notification_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Notification" ("createdAt", "fromUsername", "id", "isRead", "postId", "postOwnerUsername", "updatedAt") SELECT "createdAt", "fromUsername", "id", "isRead", "postId", "postOwnerUsername", "updatedAt" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
