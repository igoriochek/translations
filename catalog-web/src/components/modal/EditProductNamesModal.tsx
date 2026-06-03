import {useEffect, useState} from "react";
import Modal from "./Modal.tsx";
import type {Language, Product, TranslationInput} from "../../api/types.ts";
import {getLanguages} from "../../api/languages.ts";
import {updateProduct} from "../../api/products.ts";
import TranslationInputs from "../TranslationInputs.tsx";

interface EditProductNamesModalProps {
	open: boolean;
	product: Product | null;
	onClose: () => void;
	onUpdated: (product: Product) => void;
}

export default function EditProductNamesModal({
												  open,
												  product,
												  onClose,
												  onUpdated
											  }: EditProductNamesModalProps) {
	const [languages, setLanguages] = useState<Language[]>([]);
	const [translations, setTranslations] = useState<TranslationInput[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open || !product)
			return;

		async function load() {
			const loadedLanguages = await getLanguages();
			setLanguages(loadedLanguages);
			setTranslations(loadedLanguages.map((language) => ({
				language_id: language.id,
				value: product!.names.find(
					(x) =>
						x.language.id ===
						language.id
				)?.name ?? ''
			})));
		}

		load();
	}, [open, product]);

	async function handleSave() {
		if (!product)
			return;

		try {
			setLoading(true);

			const updated =
				await updateProduct(product.id, {
						names: translations.map((x) => ({
							language_id: x.language_id,
							name: x.value
						}))
					}
				);

			onUpdated(updated);
			onClose();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Modal open={open} title="Edit Names" onClose={onClose}>
			<div className="space-y-6">
				<TranslationInputs
					languages={languages}
					translations={translations}
					onChange={setTranslations}
					label="Names"
				/>

				<div className="flex justify-end">
					<button
						onClick={handleSave}
						disabled={loading}
						className="bg-black text-white px-4 py-2 rounded-xl"
					>
						Save
					</button>
				</div>
			</div>
		</Modal>
	);
}