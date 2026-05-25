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

/** 分包静态资源路径前缀 */
export const ASSETS = {
  HOME: '/subpackage/home/static',
  PRODUCTS: '/subpackage/products/static',
  NEWS: '/subpackage/news/static',
  ABOUT: '/subpackage/about/static',
  TABS: '/static/tabs',
} as const;
