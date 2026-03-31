-- DropIndex
DROP INDEX IF EXISTS "User_email_key";

-- AlterTable: Drop password, add Clerk fields (clerk_id nullable first)
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN "clerk_id" VARCHAR(255),
ADD COLUMN "first_name" TEXT,
ADD COLUMN "last_name" TEXT,
ADD COLUMN "username" TEXT,
ADD COLUMN "image_url" TEXT,
ADD COLUMN "last_sign_in_at" TIMESTAMP(3);

-- Delete existing users without clerk_id (they have no valid auth)
DELETE FROM "User" WHERE "clerk_id" IS NULL;

-- Now enforce NOT NULL
ALTER TABLE "User" ALTER COLUMN "clerk_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_clerk_id_key" ON "User"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_clerk_id_idx" ON "User"("clerk_id");
