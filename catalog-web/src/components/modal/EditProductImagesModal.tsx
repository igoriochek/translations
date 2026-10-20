import {useState} from "react";

import Modal from "./Modal.tsx";

import type {Product} from "../../api/types.ts";
import {deleteProductImage, uploadProductImages} from "../../api/products.ts";
import ProductImageGrid from "../product/ProductImageGrid.tsx";
import ProductImageUploader from "../product/ProductImageUploader.tsx";
import {strings} from "../../utils/localization.ts";

interface EditProductImagesModalProps {
	open: boolean;
	product: Product | null;
	onClose: () => void;
	onUpdated: (product: Product) => void;
}

export default function EditProductImagesModal({
												   open,
												   product,
												   onClose,
												   onUpdated
											   }: EditProductImagesModalProps) {
	const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);

	if (!product)
		return null;

	function addImages(files: File[]) {
		setImagesToUpload((prev) => [...prev, ...files]);
	}

	async function handleDelete(imageId: number) {
		try {
			const updated = await deleteProductImage(product!.id, imageId);
			onUpdated(updated);
		} catch (err) {
			console.error(err);
		}
	}

	async function handleSave() {
		if (!imagesToUpload.length)
			return onClose();

		try {
			setLoading(true);

			const updated = await uploadProductImages(product!.id, imagesToUpload);
			onUpdated(updated);
			setImagesToUpload([]);
			onClose();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Modal open={open} title={strings.products.edit_images_button} onClose={onClose}>
			<div className="space-y-6">
				<ProductImageGrid images={product.images} onDelete={handleDelete}/>
				<ProductImageUploader onAdd={addImages}/>
				{imagesToUpload.length > 0 && (
					<div className="text-sm text-zinc-500">
						{imagesToUpload.length} new image(s) selected
					</div>
				)}

				<div className="flex justify-end">
					<button
						onClick={handleSave}
						disabled={loading}
						className="bg-black text-white px-4 py-2 rounded-xl"
					>
						{loading ?
							strings.saving :
							strings.save_button}
					</button>
				</div>
			</div>
		</Modal>
	);
}