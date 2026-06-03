import Modal from "./Modal.tsx";
import type {Product} from "../../api/types.ts";
import ProductForm from "../product/ProductForm.tsx";

interface AddProductModalProps {
	open: boolean;
	onClose: () => void;
	onCreated: (product: Product) => void;
}

export default function AddProductModal({open, onClose, onCreated}: AddProductModalProps) {
	return (
		<Modal open={open} title="Add Product" onClose={onClose}>
			<ProductForm onCreated={(product) => {
				onCreated(product);
				onClose();
			}}/>
		</Modal>
	);
}