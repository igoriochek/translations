import {api} from "./axios.ts";
import type {
	PaginatedResponse,
	Product,
	ProductIngredientRequest,
	ProductListItem,
	ProductNutritionRequest
} from "./types.ts";

export async function getProducts(
	page = 1,
	perPage = 20,
	filters?: {
		name?: string;
		manufacturer_ids?: number[];
		category_ids?: number[];
	}
) {

	const response =
		await api.get<PaginatedResponse<ProductListItem>>('/admin/products', {
			params: {page, perPage, ...filters}
		});

	const data = response.data;

	return data;
}

export async function getAllProducts() {
	const response = await api.get<ProductListItem[]>('/admin/products/all');

	return response.data;
}

export async function getProductById(id: number): Promise<Product> {
	const response = await api.get<Product>('/products/' + id);

	return response.data;
}

export async function createProduct(formData: FormData): Promise<Product> {
	const response = await api.post<Product>('/admin/products', formData, {
		headers: {'Content-Type': 'multipart/form-data'}
	});

	return response.data;
}

export async function updateProduct(
	id: number,
	data: Partial<{
		names: { language_id: number; name: string; }[];
		descriptions: { language_id: number; description: string; }[];
		categories: number[];
		allergens: number[];
		related_products: number[];
		certifications: number[];
	}> | { ingredients: ProductIngredientRequest[] } | { nutritional_measurements: ProductNutritionRequest[] }
) {
	const response = await api.put<Product>(`/admin/products/${id}`, data);

	return response.data;
}

export async function uploadProductImages(id: number, files: File[]) {
	const formData = new FormData();
	files.forEach((file) => formData.append('images[]', file));

	const response = await api.post<Product>(`/admin/products/${id}/images`,
		formData,
		{headers: {'Content-Type': 'multipart/form-data'}}
	);

	return response.data;
}

export async function deleteProductImage(productId: number, imageId: number) {
	const response =
		await api.delete<Product>(`/admin/products/${productId}/images/${imageId}`);

	return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
	await api.delete(`/admin/products/${id}`);
}