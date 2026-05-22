import equipmentData from '@/data/equipment.json';
import companyData from '@/data/company.json';
import type {
  Category,
  CompanyData,
  EquipmentData,
  Product,
  Banner,
} from '@/types/content';

const equipment = equipmentData as EquipmentData;
const company = companyData as CompanyData;

export function getCategories(): Category[] {
  return equipment.categories;
}

export function getBanners(): Banner[] {
  return equipment.banners || [];
}

export function getProducts(categoryId?: string): Product[] {
  let list = [...equipment.products].sort((a, b) => a.sort - b.sort);
  if (categoryId) {
    list = list.filter((p) => p.categoryId === categoryId);
  }
  return list;
}

export function getFeaturedProducts(): Product[] {
  return equipment.products
    .filter((p) => p.featured)
    .sort((a, b) => a.sort - b.sort);
}

export function getProductById(id: string): Product | undefined {
  return equipment.products.find((p) => p.id === id);
}

export function getCompany(): CompanyData {
  return company;
}
