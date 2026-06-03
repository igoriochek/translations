import { api } from './axios';
import type {Manufacturer} from "./types.ts";

export async function getManufacturers(): Promise<Manufacturer[]> {

    const response = await api.get('/manufacturers');

    return response.data;
}

export async function createManufacturer(
    name: string,
    country?: string
) : Promise<Manufacturer> {

    country = country?.trim();

    const response = await api.post('/admin/manufacturers', {
        name: name,
        country: country && country !== "" ? country : undefined
    });

    return response.data;
}

export async function updateManufacturer(manufacturer: Manufacturer) : Promise<Manufacturer> {
    const country = manufacturer.country?.trim() ?? "";

    const response = await api.put(`/admin/manufacturers/${manufacturer.id}`, {...manufacturer, country: country !== "" ? country : undefined});

    return response.data;
}

export async function deleteManufacturer(id: number) : Promise<void> {
    await api.delete(`/admin/manufacturers/${id}`);
}