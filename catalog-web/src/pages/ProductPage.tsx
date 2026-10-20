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
import ProductRecipesSection from "../components/product/ProductRecipesSection.tsx";
import ProductUsageInstructionsSection from "../components/product/ProductUsageInstructionsSection.tsx";
import ProductSellersSection from "../components/product/ProductSellersSection.tsx";
import EditProductUsageInstructionsModal from "../components/modal/EditProductUsageInstructionsModal.tsx";
import EditProductDescriptionsModal from "../components/modal/EditProductDescriptionsModal.tsx";
import ProductDescriptionsSection from "../components/product/ProductDescriptionsSection.tsx";
import Barcode from "react-barcode";
import {strings} from "../utils/localization.ts";
import {useLanguage} from "../utils/LanguageContext.tsx";

export default function ProductPage() {

	const {id} = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);

	useLanguage();

	const [showEditImagesModal, setShowEditImagesModal] = useState(false);
	const [showEditNamesModal, setShowEditNamesModal] = useState(false);
	const [showEditDescriptionsModal, setShowEditDescriptionsModal] = useState(false);
	const [showEditCategoriesModal, setShowEditCategoriesModal] = useState(false);
	const [showEditAllergensModal, setShowEditAllergensModal] = useState(false);
	const [showEditRelatedProductsModal, setShowEditRelatedProductsModal] = useState(false);
	const [showEditIngredientsModal, setShowEditIngredientsModal] = useState(false);
	const [showEditNutritionModal, setShowEditNutritionModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditUsageInstructionsModal, setShowEditUsageInstructionsModal] = useState(false);

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
				<p>{strings.products.not_found}</p>
			</AdminLayout>
		);

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold">
							{product.names[0]?.name ?? strings.missing_field}
						</h1>

						<p className="text-zinc-600 mt-1">
							{product.manufacturer.name}
						</p>
					</div>

					<Barcode value={product.product_code} background="#f4f4f5" height={40} fontSize={16}/>
				</div>

				<ProductImagesSection product={product} onEdit={() => setShowEditImagesModal(true)}/>
				<ProductNamesSection product={product} onEdit={() => setShowEditNamesModal(true)}/>
				<ProductDescriptionsSection product={product} onEdit={() => setShowEditDescriptionsModal(true)}/>
				<ProductCategoriesSection product={product} onEdit={() => setShowEditCategoriesModal(true)}/>
				<ProductRecipesSection product={product}/>
				<ProductIngredientsSection product={product} onEdit={() => setShowEditIngredientsModal(true)}/>
				<ProductNutritionSection product={product} onEdit={() => setShowEditNutritionModal(true)}/>
				<ProductUsageInstructionsSection product={product} onEdit={() => setShowEditUsageInstructionsModal(true)}/>
				<ProductAllergensSection product={product} onEdit={() => setShowEditAllergensModal(true)}/>
				<ProductSellersSection product={product}/>
				<ProductRelatedProductsSection product={product} onEdit={() => setShowEditRelatedProductsModal(true)}/>
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

			<EditProductDescriptionsModal
				open={showEditDescriptionsModal}
				product={product}
				onClose={() => setShowEditDescriptionsModal(false)}
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
				title={strings.products.delete_button}
				message={strings.products.delete_confirm}
				confirmText={strings.delete_button}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={() => {
					handleDelete().then(() => {
						setShowDeleteModal(false)
					})
				}}
			/>

			<EditProductUsageInstructionsModal
				open={showEditUsageInstructionsModal}
				product={product}
				onClose={() => setShowEditUsageInstructionsModal(false)}
				onUpdated={setProduct}
			/>
		</AdminLayout>
	);
}