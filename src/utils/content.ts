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

/** Main-package cover for products tab list (subpackage static fails on main tab). */
function getListCover(productId: string): string {
  return `/static/products/list/${productId}.jpg`;
}

export function getProducts(categoryId?: string): Product[] {
  let list = [...equipment.products].sort((a, b) => a.sort - b.sort);
  if (categoryId) {
    list = list.filter((p) => p.categoryId === categoryId);
  }
  return list.map((p) => ({ ...p, cover: getListCover(p.id) }));
}

/** Main-package covers for home tab (subpackage static fails on device first paint). */
function getHomeFeaturedCover(productId: string): string {
  return `/static/home/featured/${productId}.png`;
}

export function getFeaturedProducts(): Product[] {
  return equipment.products
    .filter((p) => p.featured)
    .sort((a, b) => a.sort - b.sort)
    .map((p) => ({ ...p, cover: getHomeFeaturedCover(p.id) }));
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
