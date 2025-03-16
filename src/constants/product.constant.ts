export const PRODUCT_CONSTANTS = {
  MODEL_NAME: 'products',
  CACHING_PAGINATION: (page: number, per_page: number) =>
    `products_page:${page}_per_page:${per_page}`,
  CACHING_PAGINATION_SECONDS: 60 * 2,
  PRODUCTS_PATTERN: 'products_',
};
