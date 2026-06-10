import { api } from './axios';
import type {SellerListItem} from "./types.ts";

export async function getDashboardStats() {
    const response = await api.get('/admin/dashboard/stats');

    return response.data;
}

export async function getSellerData(): Promise<SellerListItem[]> {
    const response = await api.get('/admin/dashboard/sellers');

    return response.data;
}