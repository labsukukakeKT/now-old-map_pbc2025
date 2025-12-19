-- CreateTable
CREATE TABLE "post" (
    "post_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "place_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "user_photo" TEXT,
    "photo_url" TEXT,
    "uploaded_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "user_DB" (
    "user_id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_description" TEXT,
    "user_photo_url" TEXT,

    CONSTRAINT "user_DB_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "place_DB" (
    "place_id" SERIAL NOT NULL,
    "lattitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "place_name" TEXT NOT NULL,
    "place_description" TEXT,
    "place_photo_url" TEXT,
    "place_era_start" INTEGER NOT NULL,
    "place_era_end" INTEGER NOT NULL,

    CONSTRAINT "place_DB_pkey" PRIMARY KEY ("place_id")
);

-- CreateIndex
CREATE INDEX "post_user_id_idx" ON "post"("user_id");

-- CreateIndex
CREATE INDEX "post_place_id_idx" ON "post"("place_id");

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_DB"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "place_DB"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;
