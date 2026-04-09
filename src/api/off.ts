/**
 * Open Food Facts API Integration
 */

export interface OFFProduct {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  image?: string;
}

export type APIResult<T> = { data: T | null; error: string | null };

const BASE_URL = 'https://world.openfoodfacts.org';

/**
 * Searches for products by name
 */
export async function searchProducts(query: string, limit: number = 20): Promise<APIResult<OFFProduct[]>> {
  const url = `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${limit}&cc=il`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    const products = (data.products || []).map((p: { code: string; product_name?: string; brands?: string; nutriments?: Record<string, number>; image_front_small_url?: string }) => ({
      id: p.code,
      name: p.product_name || 'Unknown Product',
      brand: p.brands,
      calories: Math.round(p.nutriments?.['energy-kcal_100g'] || 0),
      protein: p.nutriments?.protein_100g || 0,
      fat: p.nutriments?.fat_100g || 0,
      carbs: p.nutriments?.carbohydrates_100g || 0,
      image: p.image_front_small_url,
    }));
    return { data: products, error: null };
  } catch (error) {
    return { data: [], error: error instanceof Error ? error.message : 'Unknown search error' };
  }
}

/**
 * Fetches product by barcode
 */
export async function getProductByBarcode(barcode: string): Promise<APIResult<OFFProduct>> {
  const url = `${BASE_URL}/api/v0/product/${barcode}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    if (data.status === 0) return { data: null, error: 'Product not found' };

    const p = data.product;
    const product = {
      id: p.code,
      name: p.product_name || 'Unknown Product',
      brand: p.brands,
      calories: Math.round(p.nutriments?.['energy-kcal_100g'] || 0),
      protein: p.nutriments?.protein_100g || 0,
      fat: p.nutriments?.fat_100g || 0,
      carbs: p.nutriments?.carbohydrates_100g || 0,
      image: p.image_front_small_url,
    };
    return { data: product, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown barcode error' };
  }
}
