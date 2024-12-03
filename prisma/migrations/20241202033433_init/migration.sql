-- AlterTable
ALTER TABLE "_CategoryToPost" ADD CONSTRAINT "_CategoryToPost_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CategoryToPost_AB_unique";

-- AlterTable
ALTER TABLE "_threadUsers" ADD CONSTRAINT "_threadUsers_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_threadUsers_AB_unique";
