import {useEffect, useState} from "react";
import {getLanguages} from "../../api/languages";
import type {Language, Product} from "../../api/types";
import {updateProduct} from "../../api/products.ts";
import {strings} from "../../utils/localization.ts";

interface Props {
	open: boolean;
	product: Product;
	onClose: () => void;
	onUpdated: (product: Product) => void;
}

export default function EditProductDescriptionsModal({
															  open,
															  product,
															  onClose,
															  onUpdated
														  }: Props) {
	const [languages, setLanguages] = useState<Language[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open)
			return;

		getLanguages()
			.then(setLanguages)
			.catch(console.error);

	}, [open]);

	if (!open)
		return null;

	async function handleCreate(
		languageId: number,
		content: string
	) {
		try {
			setLoading(true);

			const updated = await updateProduct(
				product.id,
				{
					descriptions: [
						...product.descriptions
							.map(x => {return {language_id: x.language.id, description: x.description}}),
						{description: content, language_id: languageId}
					]}
			);

			onUpdated(updated);
		} finally {
			setLoading(false);
		}
	}

	async function handleUpdate(
		id: number,
		languageId: number,
		content: string
	) {
		try {
			setLoading(true);

			if(content === "") {
				const updated = await updateProduct(
					product.id,
					{
						descriptions: [
							...product.descriptions
								.filter(x=> x.id !== id)
								.map(x => {return {language_id: x.language.id, description: x.description}})
						]
					}
				)
				onUpdated(updated);
			} else {
				const updated = await updateProduct(
					product.id,
					{
						descriptions: [
							...product.descriptions
								.filter(x=> x.id !== id)
								.map(x => {return {language_id: x.language.id, description: x.description}}),
							{description: content, language_id: languageId}
						]
					}
				)
				onUpdated(updated);
			}
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete(id: number) {
		try {
			setLoading(true);

			const updated = await updateProduct(
				product.id,
				{
					descriptions: [
						...product.descriptions
							.filter(x=> x.id !== id)
							.map(x => {return {language_id: x.language.id, description: x.description}})
					]
				}
			)
			onUpdated(updated);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="
			fixed
			inset-0
			bg-black/40
			backdrop-blur-sm
			flex
			items-center
			justify-center
			p-4
			z-50
		">
			<div className="
				bg-white
				rounded-2xl
				shadow-xl
				p-6
				w-full
				max-w-4xl
				max-h-[90vh]
				overflow-y-auto
			">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-bold">
						{strings.products.descriptions_field}
					</h2>

					<button onClick={onClose} className="text-zinc-500 text-2xl">
						×
					</button>

				</div>

				<div className="space-y-6">
					{languages.map(
						language => {
							const existing =
								product
									.descriptions
									.find(x => x.language.id === language.id);

							return (
								<div
									key={language.id}
									className="border rounded-lg p-4"
								>
									<h3 className="font-mediummb-2">
										{language.name}
									</h3>

									<textarea
										defaultValue={existing?.description ?? ""}
										className="w-full border rounded-lg p-2 min-h-[120px]"
										onBlur={async e => {
											if (existing) {
												await handleUpdate(existing.id, language.id, e.target.value);
											} else if (e.target.value.trim()) {
												await handleCreate(language.id, e.target.value);
											}
										}}
									/>

									{existing && (
										<div className="mt-2">
											<button
												onClick={() => handleDelete(existing.id)}
												className="text-red-600 text-sm"
											>
												{strings.delete_button}
											</button>
										</div>
									)}
								</div>
							);
						}
					)}
				</div>

				<div className="mt-6 flex justify-end">
					<button
						onClick={onClose}
						disabled={loading}
						className="bg-black text-white px-4 py-2 rounded-lg">
						{loading ?
							strings.saving :
							strings.save_button}
					</button>
				</div>
			</div>
		</div>
	);
}