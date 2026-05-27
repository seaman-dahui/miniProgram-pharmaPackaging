export interface Category {
  id: string;
  name: string;
  emoji: string;
  icon?: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Feature {
  title: string;
  desc: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  summary: string;
  cover: string;
  images: string[];
  tags: string[];
  specs: Spec[];
  features: Feature[];
  applications: string[];
  featured?: boolean;
  sort: number;
}

export interface Banner {
  id: string;
  image: string;
  title?: string;
  linkProductId?: string;
}

export interface EquipmentData {
  categories: Category[];
  products: Product[];
  banners: Banner[];
}

export interface CultureBlock {
  title: string;
  content: string;
}

export interface CultureLabel {
  zh: string;
  en: string;
}

export interface CultureFormula {
  title: string;
  content: string;
  formula: string[];
  result: string;
}

export interface CultureServiceTenet {
  title: string;
  content: string;
  values: CultureLabel[];
}

export interface NewsBlock {
  type: 'text' | 'image';
  content: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  publishTime: string;
  blocks: NewsBlock[];
}

export interface NewsData {
  articles: NewsArticle[];
}

export interface CompanyCulture {
  blocks: CultureBlock[];
  coreValues: CultureLabel[];
  businessPhilosophy: CultureFormula;
  serviceTenet: CultureServiceTenet;
  actionValues: CultureLabel[];
}

export interface Contact {
  salesPhone: string;
  afterSalesPhone: string;
  fax: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface CompanyData {
  brandName: string;
  slogan: string;
  logo: string;
  intro: string[];
  introSummary: string;
  culture: CompanyCulture;
  honorsImage: string;
  partnerImage: string;
  contact: Contact;
}
