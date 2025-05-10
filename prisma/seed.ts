import { Product, Brand, Category, Subcategory, PrismaClient } from '@prisma/client';
const db = new PrismaClient();

const categories: Category[] = require('../src/dev-data/mini-data/categories.json');
const subcategories: Subcategory[] = require('../src/dev-data/mini-data/subcategories.json');
const brands: Brand[] = require('../src/dev-data/mini-data/brands.json');
const products: Product[] = require('../src/dev-data/mini-data/products.json');


const importData = async () => {
  console.log(`Start seeding ...`);
  try {
    console.log(brands);

    await db.brand.createMany({ data: brands });
    await db.category.createMany({ data: categories });
    await db.subcategory.createMany({ data: subcategories });
    await db.product.createMany({ data: products });

    console.log(await db.brand.findMany());
    console.log(await db.category.findMany());
    console.log(await db.subcategory.findMany());
    console.log(await db.product.findMany());
  } catch (error) {
    console.error(error);
  }
  console.log(`Seeding finished.`);
  process.exit();
};

const deleteData = async () => {
  console.log(`Start deleting ...`);
  try {
    await db.product.deleteMany();
    await db.subcategory.deleteMany();
    await db.brand.deleteMany();
    await db.category.deleteMany();

    console.log(await db.brand.findMany());
    console.log(await db.category.findMany());
    console.log(await db.subcategory.findMany());
    console.log(await db.product.findMany());
  } catch (error) {
    console.error(error);
  }
  console.log(`deleting finished.`);
  process.exit();
};

if (['--import', '-i'].includes(process.argv[2])) {
  importData();
}
if (['--delete', '-d'].includes(process.argv[2])) {
  deleteData();
}