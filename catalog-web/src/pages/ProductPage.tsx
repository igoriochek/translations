import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

import AdminLayout from "../layouts/AdminLayout";

import type {Product} from "../api/types.ts";

import {deleteProduct, getProductById} from "../api/products.ts";
import ProductPageSkeleton from "../components/skeleton/ProductPageSkeleton.tsx";
import ProductDangerZoneSection from "../components/product/ProductDangerZoneSection.tsx";
import ProductRelatedProductsSection from "../components/product/ProductRelatedProductsSection.tsx";
import ProductAllergensSection from "../components/product/ProductAllergenSection.tsx";
import ProductNutritionSection from "../components/product/ProductNutritionSection.tsx";
import ProductIngredientsSection from "../components/product/ProductIngredientSection.tsx";
import ProductCategoriesSection from "../components/product/ProductCategoriesSection.tsx";
import ProductNamesSection from "../components/product/ProductNamesSection.tsx";
import ProductImagesSection from "../components/product/ProductImagesSection.tsx";
import EditProductNamesModal from "../components/modal/EditProductNamesModal.tsx";
import EditProductAllergensModal from "../components/modal/EditProductAllergensModal.tsx";
import EditProductRelatedProductsModal from "../components/modal/EditProductRelatedProductsModal.tsx";
import EditProductCategoriesModal from "../components/modal/EditProductCategoriesModal.tsx";
import EditProductNutritionModal from "../components/modal/EditProductNutritionModal.tsx";
import EditProductIngredientsModal from "../components/modal/EditProductIngredientsModal.tsx";
import EditProductImagesModal from "../components/modal/EditProductImagesModal.tsx";
import ConfirmModal from "../components/modal/ConfirmModal.tsx";

export default function ProductPage() {

	const {id} = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);

	const [showEditImagesModal, setShowEditImagesModal] = useState(false);
	const [showEditNamesModal, setShowEditNamesModal] = useState(false);
	const [showEditCategoriesModal, setShowEditCategoriesModal] = useState(false);
	const [showEditAllergensModal, setShowEditAllergensModal] = useState(false);
	const [showEditRelatedProductsModal, setShowEditRelatedProductsModal] = useState(false);
	const [showEditIngredientsModal, setShowEditIngredientsModal] = useState(false);
	const [showEditNutritionModal, setShowEditNutritionModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	async function handleDelete() {
		if (!product)
			return;

		try {
			await deleteProduct(product.id);
			navigate("/products");
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		async function loadProduct() {
			try {
				setLoading(true);

				const data = await getProductById(Number(id));
				setProduct(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		if (!id)
			return;

		loadProduct();
	}, [id]);

	if (loading)
		return (
			<AdminLayout>
				<ProductPageSkeleton/>
			</AdminLayout>
		);

	if (!product)
		return (
			<AdminLayout>
				<p>
					Product not found.
				</p>
			</AdminLayout>
		);

	return (
		<AdminLayout>

			<div className="space-y-6">

				<div>

					<h1 className="text-3xl font-bold">
						{product.names[0]?.name ?? "Unnamed"}
					</h1>

					<p className="text-zinc-600 mt-1">
						{product.manufacturer.name}
					</p>

				</div>

				<ProductImagesSection product={product} onEdit={() => setShowEditImagesModal(true)}/>
				<ProductNamesSection product={product} onEdit={() => setShowEditNamesModal(true)} />
				<ProductCategoriesSection product={product} onEdit={() => setShowEditCategoriesModal(true)} />
				<ProductIngredientsSection product={product} onEdit={() => setShowEditIngredientsModal(true)} />
				<ProductNutritionSection product={product} onEdit={() => setShowEditNutritionModal(true)} />
				<ProductAllergensSection product={product} onEdit={() => setShowEditAllergensModal(true)} />
				<ProductRelatedProductsSection product={product} onEdit={() => setShowEditRelatedProductsModal(true)} />
				<ProductDangerZoneSection onDelete={() => setShowDeleteModal(true)}/>
			</div>

			<EditProductImagesModal
				open={showEditImagesModal}
				product={product}
				onClose={() =>
					setShowEditImagesModal(false)
				}
				onUpdated={setProduct}
			/>

			<EditProductNamesModal
				open={showEditNamesModal}
				product={product}
				onClose={() => setShowEditNamesModal(false)}
				onUpdated={setProduct}
			/>

			<EditProductCategoriesModal
				open={showEditCategoriesModal}
				product={product}
				onClose={() => setShowEditCategoriesModal(false)}
				onUpdated={setProduct}
			/>

			<EditProductIngredientsModal
				open={showEditIngredientsModal}
				product={product}
				onClose={() => setShowEditIngredientsModal(false)}
				onUpdated={setProduct}
			/>

			<EditProductNutritionModal
				open={showEditNutritionModal}
				product={product}
				onClose={() => setShowEditNutritionModal(false)}
				onUpdated={setProduct}
			/>

			<EditProductAllergensModal
				open={showEditAllergensModal}
				product={product}
				onClose={() => setShowEditAllergensModal(false)}
				onUpdated={setProduct}
			/>

			<EditProductRelatedProductsModal
				open={showEditRelatedProductsModal}
				product={product}
				onClose={() => setShowEditRelatedProductsModal(false)}
				onUpdated={setProduct}
			/>

			<ConfirmModal
				open={showDeleteModal}
				title="Delete Product"
				message="Are you sure you want to delete this product?"
				confirmText="Delete"
				onClose={() =>
					setShowDeleteModal(false)
				}
				onConfirm={() => {
					handleDelete().then(() => {setShowDeleteModal(false);});
				}}
			/>
		</AdminLayout>
	);
}