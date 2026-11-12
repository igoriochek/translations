import {useEffect, useState} from "react";
import Modal from "./Modal.tsx";
import type {Category, Product} from "../../api/types.ts";
import {getCategories} from "../../api/categories.ts";
import {updateProduct} from "../../api/products.ts";
import EntitySelector, {type EntitySelectorItem} from "../product/EntitySelector.tsx";
import {getLocalizedField, strings} from "../../utils/localization.ts";
import {useLanguage} from "../../utils/LanguageContext.tsx";

interface EditProductCategoriesModalProps {
	open: boolean;
	product: Product | null;
	onClose: () => void;
	onUpdated: (product: Product) => void;
}

export default function EditProductCategoriesModal({
													   open,
													   product,
													   onClose,
													   onUpdated
												   }: EditProductCategoriesModalProps) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [loading, setLoading] = useState(false);

	const {language} = useLanguage();

	useEffect(() => {
		if (!open || !product)
			return;

		async function load() {
			const data = await getCategories();
			setCategories(data);
			setSelectedIds(product!.categories.map((x) => x.id));
		}

		load();
	}, [open, product]);

	async function handleSave() {
		if (!product)
			return;

		try {
			setLoading(true);

			const updated = await updateProduct(product.id, {categories: selectedIds});
			onUpdated(updated);
			onClose();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	const items: EntitySelectorItem[] = categories.map((category) => {
		const primaryName =
			getLocalizedField(language, category.names.map(x => { return {
				language: x.language, field: x.name
			}}));

		return {
			id: category.id,
			label: primaryName?.field ?? `${strings.missing_field} #${category.id}`
		}
	});

	return (
		<Modal open={open} title={strings.products.edit_categories_button} onClose={onClose}>
			<div className="space-y-6">
				<EntitySelector
					label={strings.categories_title}
					items={items}
					selectedIds={selectedIds}
					onChange={setSelectedIds}
				/>

				<div className="flex justify-end">
					<button onClick={handleSave} disabled={loading}
					        className="bg-black text-white px-4 py-2 rounded-xl">
						{loading ?
							strings.saving :
							strings.save_button}
					</button>
				</div>
			</div>
		</Modal>
	);
}