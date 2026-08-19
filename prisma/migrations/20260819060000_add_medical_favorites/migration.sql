CREATE TABLE "MedicalFavorite" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "termId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MedicalFavorite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MedicalFavorite_userId_termId_key" ON "MedicalFavorite"("userId", "termId");
CREATE INDEX "MedicalFavorite_userId_idx" ON "MedicalFavorite"("userId");
ALTER TABLE "MedicalFavorite" ADD CONSTRAINT "MedicalFavorite_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
