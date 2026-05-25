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

export interface Milestone {
  year: string;
  event: string;
}

export interface Certification {
  name: string;
  image: string;
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
  milestones: Milestone[];
  certifications: Certification[];
  contact: Contact;
}
