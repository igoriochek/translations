
import {useEffect, useState} from "react";
import Modal from "./Modal.tsx";
import type {Certification, Product} from "../../api/types.ts";
import {getCertifications} from "../../api/certifications.ts";
import {updateProduct} from "../../api/products.ts";
import EntitySelector, {type EntitySelectorItem} from "../product/EntitySelector.tsx";
import {strings} from "../../utils/localization.ts";

interface EditProductCertificationsModalProps {
	open: boolean;
	product: Product | null;
	onClose: () => void;
	onUpdated: (product: Product) => void;
}

export default function EditProductCertificationsModal({
														   open,
														   product,
														   onClose,
														   onUpdated
													   }: EditProductCertificationsModalProps) {
	const [certifications, setCertifications] = useState<Certification[]>([]);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open || !product)
			return;

		async function load() {
			try {
				const data = await getCertifications();
				setCertifications(data);
				setSelectedIds(product!.certifications.map((x) => x.id));
			} catch (err) {
				console.error(err);
			}
		}

		load();
	}, [open, product]);

	async function handleSave() {
		if (!product)
			return;

		try {
			setLoading(true);

			const updated = await updateProduct(product.id, {
				certifications: selectedIds
			});

			onUpdated(updated);
			onClose();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	const items: EntitySelectorItem[] = certifications.map((certification) => ({
		id: certification.id,
		label: certification.label
	}));

	return (
		<Modal open={open} title={strings.certifications.edit_buton} onClose={onClose}>
			<div className="space-y-6">
				<EntitySelector
					label={strings.certifications_title}
					items={items}
					selectedIds={selectedIds}
					onChange={setSelectedIds}
				/>

				<div className="flex justify-end">
					<button
						onClick={handleSave}
						disabled={loading}
						className="bg-black text-white px-4 py-2 rounded-xl"
					>
						{loading ? strings.saving : strings.save_button}
					</button>
				</div>
			</div>
		</Modal>
	);
}
