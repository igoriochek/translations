import AdminLayout from '../layouts/AdminLayout';
import {useEffect, useState} from 'react';

import type {ProductListItem, Seller, SellerListItem, SellerProduct, SellerStore} from "../api/types.ts";

import {getSellerData} from "../api/dashboard.ts";
import {deleteRecommendation, deleteSeller, deleteSellerProduct, deleteStore, getSeller} from "../api/sellers.ts";

import SellerSkeleton from "../components/skeleton/SellerSkeleton.tsx";
import SellerCard from "../components/card/SellerCard.tsx";

import AddSellerModal from "../components/modal/AddSellerModal.tsx";

import {Pencil, Trash2, XIcon} from "lucide-react";
import CollapsableSection from "../components/CollapsableSection.tsx";
import AddStoreModal from "../components/modal/AddStoreModal.tsx";
import ConfirmModal from "../components/modal/ConfirmModal.tsx";
import SellerProductRow from "../components/SellerProductRow.tsx";
import AddSellerProductModal from "../components/modal/AddSellerProductModal.tsx";
import AddRecommendationModal from "../components/modal/AddRecommendationModal.tsx";
import {useLanguage} from "../utils/LanguageContext.tsx";
import {getLocalizedField, strings} from "../utils/localization.ts";

export default function SellersPage() {

	const [sellers, setSellers] = useState<SellerListItem[]>([]);
	const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
	const [selectedStore, setSelectedStore] = useState<SellerStore | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<SellerProduct | null>(null);
	const [selectedRecommendation, setSelectedRecommendation] = useState<ProductListItem | null>(null);

	const [loading, setLoading] = useState(true);
	const [loadingCard, setLoadingCard] = useState(0);

	const [showAddModal, setShowAddModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showAddStoreModal, setShowAddStoreModal] = useState(false);
	const [showDeleteStoreModal, setShowDeleteStoreModal] = useState(false);
	const [showAddProductModal, setShowAddProductModal] = useState(false);
	const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
	const [showAddRecommendationModal, setShowAddRecommendationModal] = useState(false);
	const [showDeleteRecommendationModal, setShowDeleteRecommendationModal] = useState(false);

	const [storesExpanded, setStoresExpanded] = useState(false);
	const [productsExpanded, setProductsExpanded] = useState(false);

	const [storesFilter, setStoresFilter] = useState("");
	const [productsFilter, setProductsFilter] = useState("");

	const { language } = useLanguage();

	useEffect(() => {
		async function loadSellers() {
			setLoading(true);

			try {
				const data = await getSellerData();
				setSellers(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		loadSellers();
	}, []);

	async function selectSeller(id: number) {

		try {

			setLoadingCard(id);

			const seller = await getSeller(id);

			setSelectedSeller(seller);

		} catch (e) {

			console.error(e);

		} finally {

			setLoadingCard(0);
		}
	}

	function filterStores(stores: SellerStore[]) {
		return stores.filter((x) => x.location.toLowerCase().includes(storesFilter));
	}

	function filterProducts(products: SellerProduct[]) {
		return products.filter((x) => x.product.names.map((p => p.name.toLowerCase())).join().includes(productsFilter));
	}

	async function handleDeleteSeller(id: number) {
		try {
			await deleteSeller(id);

			setSellers((prev) => prev.filter((x) => x.id !== id));

			setSelectedSeller(null);
			setSelectedStore(null);
			setSelectedProduct(null);
			setSelectedRecommendation(null);
		} catch (e) {
			console.error(e);
		}
	}

	async function handleDeleteProduct() {
		try {
			const seller = await deleteSellerProduct(selectedSeller!.id, selectedProduct!.id);
			setSelectedSeller(seller);

			setSellers((prev) =>
				prev.map((x) => {
					if (x.id !== seller.id)
						return x;

					return {
						...x,
						products_count: seller.products.length
					};
				})
			);

			setSelectedProduct(null);
		} catch (err) {
			console.error(err);
		}
	}

	async function handleDeleteStore() {
		try {
			await deleteStore(selectedStore!.id);

			setSellers((prev) => prev.map((seller) => {
				if (seller.id !== selectedSeller!.id)
					return seller;

				return {
					...seller,
					stores_count: seller.stores_count - 1
				}
			}));

			setSelectedSeller((prev) => {
				if (!prev) return prev;

				return {
					...prev,
					stores: prev.stores.filter((s) => s.id !== selectedStore!.id),
				}
			})

			setSelectedStore(null);
		} catch (e) {
			console.error(e);
		}
	}

	async function handleDeleteRecommendation() {
		try {
			const seller = await deleteRecommendation(selectedSeller!.id, selectedProduct!.id, selectedRecommendation!.id);
			setSelectedSeller(seller);

			const updatedProduct = seller.products.find((x) => x.id === selectedProduct!.id);
			setSelectedProduct(updatedProduct ?? null);
			setSelectedRecommendation(null);
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">
							{strings.sellers_title}
						</h1>

						<p className="text-zinc-600">
							{strings.sellers.hint}
						</p>
					</div>

					<button
						className="
                            bg-black
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                        "
						onClick={() => setShowAddModal(true)}
					>
						{strings.sellers.add_label}
					</button>
				</div>

				<div className="relative w-full overflow-x-hidden">
					<div
						className={`
                            transition-all
                            duration-300
                            ${selectedSeller && !showDeleteModal ? 'pr-[404px]' : ''}
                        `}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
							{loading ? (
								Array.from({length: 4}).map((_, index) => (
									<SellerSkeleton key={index}/>
								))
							) : (
								sellers.map((s) => (
									<SellerCard
										key={s.id}
										seller={s}
										loading={loadingCard == s.id}
										selected={selectedSeller?.id == s.id}
										onEdit={() => selectSeller(s.id)}
										onDelete={() => selectSeller(s.id).then(() => {
											setShowDeleteModal(true)
										})}
									/>
								))
							)}
						</div>
					</div>

					<div
						className={`
                            fixed
                            top-16
                            right-0
                            w-[380px]
                            
                            transition-all
                            duration-300
                            ${selectedSeller && !showDeleteModal
							? 'translate-x-0 opacity-100'
							: 'translate-x-full opacity-0 pointer-events-none'
						}
                        `}
					>

						<div
							className="
                                bg-white
                                rounded-xl
                                shadow-sm
                                p-6
                                min-h-[calc(100vh)]
                            "
						>

							<div className="flex items-center mb-4">

								<h2 className="flex-1 text-xl font-semibold">
									{selectedSeller?.name ?? ""}
								</h2>

								<button
									onClick={() => {
										setSelectedSeller(null);
										setSelectedStore(null);
										setSelectedProduct(null);
										setSelectedRecommendation(null);
									}}
									className="text-zinc-600 hover:text-zinc-800"
								>
									<XIcon size={18}/>
								</button>

							</div>

							{selectedSeller && (
								<div className="space-y-4">
									<div className="flex-col space-y-3">
										<CollapsableSection
											title={strings.sellers.stores}
											expanded={storesExpanded}
											onToggle={() =>
												setStoresExpanded((v) => !v)
											}
											onAdd={() => {
												setShowAddStoreModal(true);
											}}
										>
											<div
												className="max-h-[320px] overflow-y-auto space-y-2"
											>
												{selectedSeller.stores.length == 0 ? (
													<p className="text-zinc-400 font-light text-sm text-center py-2">
														{strings.sellers.no_stores}
													</p>
												) : filterStores(selectedSeller.stores).length == 0 ? (
													<p className="text-zinc-400 font-light text-sm text-center py-2">
														{strings.sellers.no_stores_found}
													</p>
												) : (
													<div className="flex-col space-y-2">
														{filterStores(selectedSeller.stores).map((store) => (
															<div className="flex flex-row space-x-1">
																<p className="text-zinc-500 flex-1">{store.location}</p>
																<button
																	className="text-zinc-500 hover:text-red-500 transition"
																	onClick={() => {
																		setSelectedStore(store);
																		setShowDeleteStoreModal(true);
																	}}
																>
																	<Trash2 size={18}/>
																</button>
															</div>
														))}
													</div>
												)}
											</div>

											{selectedSeller.stores.length !== 0 && (
												<input
													type="text"
													value={storesFilter}
													onChange={(e) => setStoresFilter(e.target.value)}
													placeholder={strings.sellers.search_stores}
													className="w-full border border-zinc-300 text-sm rounded-lg px-3 py-2"
												/>
											)}
										</CollapsableSection>

										<CollapsableSection
											title={strings.products.products}
											expanded={productsExpanded}
											onToggle={() => setProductsExpanded((v) => !v)}
											onAdd={() => setShowAddProductModal(true)}
										>
											<div
												className="max-h-[320px] overflow-y-auto space-y-2"
											>
												{selectedSeller.products.length == 0 ? (
													<p className="text-zinc-400 font-light text-sm text-center py-2">
														{strings.sellers.no_products}
													</p>
												) : filterProducts(selectedSeller.products).length == 0 ? (
													<p className="text-zinc-400 font-light text-sm text-center py-2">
														{strings.sellers.no_products_found}
													</p>
												) : (
													<div className="flex flex-col space-y-2">
														{filterProducts(
															selectedSeller.products
														).map((product) => {
															return (
																<SellerProductRow
																	key={product.id}
																	product={product}
																	selected={selectedProduct?.id === product.id}
																	onSelect={() => setSelectedProduct(product)}
																	onDelete={() => {
																		setSelectedProduct(product);
																		setShowDeleteProductModal(true);
																	}}
																/>
															)
														})}
													</div>
												)}
											</div>

											{selectedSeller.products.length !== 0 && (
												<input
													type="text"
													value={productsFilter}
													onChange={(e) => setProductsFilter(e.target.value)}
													placeholder={strings.sellers.search_products}
													className="w-full border border-zinc-300 text-sm rounded-lg px-3 py-2"
												/>
											)}
										</CollapsableSection>

										{selectedProduct && (
											<CollapsableSection
												title={strings.recommendations}
												addLabel={strings.manage_button}
												expanded={true}
												onToggle={() => {
												}}
												onAdd={() => setShowAddRecommendationModal(true)}
												icon={(<Pencil size={15}/>)}
											>
												<div className="space-y-2">
													{selectedProduct.recommendations.length === 0 ? (
														<p className="text-zinc-400 text-sm text-center py-2">
															{strings.sellers.no_recommendations}
														</p>
													) : (
														selectedProduct.recommendations.map((recommendation) => (
															<div
																key={recommendation.id}
																className="flex items-center"
															>
																<p className="flex-1 text-zinc-500">
																	{getLocalizedField(language, recommendation.names.map(y => {
																		return {
																			language: y.language, field: y.name
																		}
																	}))?.field ?? strings.missing_field}
																</p>

																<button
																	className="text-zinc-500 hover:text-red-500 transition"
																	onClick={() => {
																		setSelectedRecommendation(recommendation);
																		setShowDeleteRecommendationModal(true);
																	}}
																>
																	<Trash2 size={18}/>
																</button>
															</div>
														))
													)}
												</div>
											</CollapsableSection>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<AddSellerModal
				open={showAddModal}
				onClose={() => setShowAddModal(false)}
				onCreated={(seller) => {

					setSellers((prev) => [
						...prev,
						seller
					]);
				}}
			/>

			<AddStoreModal
				open={showAddStoreModal}
				sellerId={selectedSeller?.id ?? 0}
				onClose={() => setShowAddStoreModal(false)}
				onCreated={(store) => {
					setSellers((prev) =>
						prev.map((seller) => {
							if (seller.id !== selectedSeller!.id) {
								return seller;
							}

							return {
								...seller,
								stores_count:
									seller.stores_count + 1
							};
						})
					);

					setSelectedSeller((prev) => {
						if (!prev)
							return prev;

						return {
							...prev,
							stores: [
								...prev.stores,
								store
							]
						}
					});
				}}
			/>

			<AddSellerProductModal
				open={showAddProductModal}
				sellerId={selectedSeller?.id ?? 0}
				onClose={() => setShowAddProductModal(false)}
				onUpdated={(seller) => {
					setSelectedSeller(seller);
					setSellers((prev) => prev.map((x) => {
						if (x.id !== seller.id)
							return x;

						return {...x, products_count: seller.products.length};
					}));
				}}
			/>

			<AddRecommendationModal
				open={showAddRecommendationModal}
				sellerId={selectedSeller?.id ?? 0}
				product={selectedProduct}
				onClose={() =>
					setShowAddRecommendationModal(false)
				}
				onUpdated={(seller) => {
					setSelectedSeller(seller);

					const updatedProduct = seller.products.find((x) => x.id === selectedProduct?.id);
					setSelectedProduct(updatedProduct ?? null);
				}}
			/>

			<ConfirmModal
				open={showDeleteModal}
				title={strings.sellers.delete_label}
				message={`${strings.formatString(strings.sellers.delete_confirm, selectedSeller?.name ?? '')}`}
				confirmText={strings.delete_button}
				onClose={() => {
					setShowDeleteModal(false);
				}}
				onConfirm={() => {
					if (selectedSeller)
						handleDeleteSeller(selectedSeller.id).then(() => setShowDeleteModal(false));
				}}
			/>

			<ConfirmModal
				open={showDeleteStoreModal}
				title={strings.sellers.delete_store_label}
				message={`${strings.formatString(strings.sellers.delete_confirm, selectedStore?.location ?? '')}`}
				confirmText={strings.delete_button}
				onClose={() => {
					setShowDeleteStoreModal(false);
				}}
				onConfirm={() => {
					if (selectedSeller)
						handleDeleteStore().then(() => setShowDeleteStoreModal(false));
				}}
			/>

			<ConfirmModal
				open={showDeleteProductModal}
				title={strings.sellers.delete_product_label}
				message={`${strings.formatString(strings.sellers.delete_confirm, selectedProduct?.product.names[0].name ?? '')}`}
				confirmText={strings.delete_button}
				onClose={() => {
					setShowDeleteProductModal(false);
				}}
				onConfirm={() => {
					handleDeleteProduct().then(() => setShowDeleteProductModal(false));
				}}
			/>

			<ConfirmModal
				open={showDeleteRecommendationModal}
				title={strings.sellers.delete_recommendation_label}
				message={`${strings.formatString(strings.sellers.delete_confirm, selectedRecommendation?.names[0].name ?? '')}`}
				confirmText={strings.delete_button}
				onClose={() => {
					setShowDeleteRecommendationModal(false);
				}}
				onConfirm={() => {
					handleDeleteRecommendation().then(() => setShowDeleteRecommendationModal(false));
				}}
			/>
		</AdminLayout>
	);
}