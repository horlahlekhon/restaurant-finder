-- CreateTable
CREATE TABLE "Restaurants" (
    "id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "longitude" REAL NOT NULL,
    "latitude" REAL NOT NULL,

    PRIMARY KEY ("longitude", "latitude")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurants_id_key" ON "Restaurants"("id");
