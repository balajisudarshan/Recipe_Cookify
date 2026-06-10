-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('STARTER', 'MAIN_DISH', 'SIDE_DISH', 'DESSERT', 'BEVERAGE', 'SNACK');

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "course" "CourseType";
