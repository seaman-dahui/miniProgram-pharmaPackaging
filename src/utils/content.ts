import equipmentData from '@/subpackage/products/data/equipment.json';
import companyData from '@/subpackage/about/data/company.json';
import newsData from '@/subpackage/news/data/news.json';
import type {
  Category,
  CompanyData,
  EquipmentData,
  NewsArticle,
  NewsData,
  Product,
  Banner,
} from '@/types/content';

const equipment = equipmentData as EquipmentData;
const company = companyData as CompanyData;
const news = newsData as NewsData;

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

export function getNewsList(): NewsArticle[] {
  return [...news.articles].sort(
    (a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime(),
  );
}

export function getNewsById(id: string): NewsArticle | undefined {
  return news.articles.find((item) => item.id === id);
}
