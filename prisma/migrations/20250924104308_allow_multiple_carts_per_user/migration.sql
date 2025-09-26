-- DropIndex
DROP INDEX "public"."Cart_userId_key";

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "public"."Cart"("userId");
