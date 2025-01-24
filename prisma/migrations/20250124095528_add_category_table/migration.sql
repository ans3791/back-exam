CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Category" ("name") VALUES
('Work'),
('Personal'),
('Health');

ALTER TABLE "Task" ADD COLUMN "categoryId" INTEGER;

UPDATE "Task" SET "categoryId" = (SELECT "id" FROM "Category" WHERE "name" = 'Work');

ALTER TABLE "Task" DROP COLUMN "category";

ALTER TABLE "Task" ALTER COLUMN "categoryId" SET NOT NULL;

ALTER TABLE "Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
