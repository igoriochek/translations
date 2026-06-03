import type {Seller, SellerListItem, SellerStore} from "./types.ts";
import {api} from "./axios.ts";

export async function getSeller(id: number): Promise<Seller> {
	const response = await api.get(`/sellers/${id}`);

	return response.data;
}

export async function createSeller(name: string): Promise<SellerListItem> {
	const response = await api.post('/admin/sellers', {name});

	return response.data;
}

export async function createStore(sellerID: number, location: string): Promise<SellerStore> {
	const response = await api.post(`/admin/sellers/${sellerID}/stores`, {location: location});

	return response.data;
}

export async function deleteSeller(id: number): Promise<void> {
	await api.delete(`/admin/sellers/${id}`);
}

export async function deleteStore(id: number): Promise<void> {
	await api.delete(`/admin/stores/${id}`);
}

export async function addSellerProduct(sellerId: number, productId: number) {
	const response = await api.post<Seller>(`/admin/sellers/${sellerId}/products`, {
		product_id: productId,
		recommendations: []
	});

	return response.data;
}

export async function deleteSellerProduct(sellerId: number, productId: number) {
	const response = await api.delete<Seller>(`/admin/sellers/${sellerId}/products/${productId}`);

	return response.data;
}

export async function addRecommendations(sellerId: number, productId: number, recommendations: number[]) {
	const response =
		await api.post<Seller>(`/admin/sellers/${sellerId}/products/${productId}/recommendations`, {recommendations});

	return response.data;
}

export async function deleteRecommendation(sellerId: number, productId: number, recommendationId: number) {
	const response =
		await api.delete<Seller>(`/admin/sellers/${sellerId}/products/${productId}/recommendations/${recommendationId}`);

	return response.data;
}