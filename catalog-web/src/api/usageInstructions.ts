import type {UsageInstruction, UsageInstructionRequest} from "./types";
import {api} from "./axios";

export async function createUsageInstruction(
	productId: number,
	request: UsageInstructionRequest
): Promise<UsageInstruction> {
	const response = await api.post<UsageInstruction>(`/admin/products/${productId}/usage-instructions`, request);

	return response.data;
}

export async function updateUsageInstruction(
	id: number,
	request: UsageInstructionRequest
): Promise<UsageInstruction> {
	const response = await api.put<UsageInstruction>(`/admin/usage-instructions/${id}`, request);

	return response.data;
}

export async function deleteUsageInstruction(id: number): Promise<void> {
	await api.delete(`/admin/usage-instructions/${id}`);
}