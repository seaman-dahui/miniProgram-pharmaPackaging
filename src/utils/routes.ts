/** 分包页面路径 */
export const SUBPACKAGE = {
  HOME: '/subpackage/home/pages/index',
  PRODUCTS_INDEX: '/subpackage/products/pages/index',
  PRODUCTS_DETAIL: '/subpackage/products/pages/detail',
  NEWS_INDEX: '/subpackage/news/pages/index',
  NEWS_DETAIL: '/subpackage/news/pages/detail',
  ABOUT: '/subpackage/about/pages/index',
} as const;

/** 主包 Tab 页路径（TabBar 必须在主包） */
export const TAB = {
  HOME: '/pages/index/index',
  PRODUCTS: '/pages/products/index',
  NEWS: '/pages/news/index',
  ABOUT: '/pages/about/index',
} as const;

/** 主包静态资源路径（按模块分目录，Tab 页可直接加载） */
export const ASSETS = {
  HOME: '/static/home',
  PRODUCTS: '/static/products',
  NEWS: '/static/news',
  ABOUT: '/static/about',
  TABS: '/static/tabs',
} as const;
