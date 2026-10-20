import Modal from "./Modal.tsx";
import type {Product} from "../../api/types.ts";
import ProductForm from "../product/ProductForm.tsx";
import {strings} from "../../utils/localization.ts";

interface AddProductModalProps {
	open: boolean;
	onClose: () => void;
	onCreated: (product: Product) => void;
}

export default function AddProductModal({open, onClose, onCreated}: AddProductModalProps) {
	return (
		<Modal open={open} title={strings.products.add_button} onClose={onClose}>
			<ProductForm onCreated={(product) => {
				onCreated(product);
				onClose();
			}}/>
		</Modal>
	);
}