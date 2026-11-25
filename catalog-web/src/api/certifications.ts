import type {Certification} from "./types.ts";
import {api} from "./axios.ts";

export async function getCertifications() : Promise<Certification[]> {
	const response = await api.get<Certification[]>(`/certifications`);

	return response.data;
}

export async function createCertification(label: string, badge: File): Promise<Certification> {
	const formData = new FormData();
	formData.append("label", label);
	formData.append("image", badge);

	const response = await api.post<Certification>(
		'/admin/certifications',
		formData,
		{headers: {'Content-Type': 'multipart/form-data'}}
	);

	return response.data;
}

export async function updateCertification(certification: Certification, badge?: File): Promise<Certification> {
	const formData = new FormData();
	formData.append("label", certification.label);
	if(badge)
		formData.append("image", badge);

	const response = await api.put<Certification>(
		`/admin/certifications/${certification.id}`,
		formData,
		{headers: {'Content-Type': 'multipart/form-data'}}
	);

	return response.data;
}

export async function deleteCertification(id: number): Promise<void> {
	await api.delete(`/admin/certifications/${id}`);
}