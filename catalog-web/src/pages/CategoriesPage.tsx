import {useEffect, useState} from "react";
import AdminLayout from "../layouts/AdminLayout";
import type {Category} from "../api/types.ts";
import {deleteCategory, getCategories} from "../api/categories.ts";
import CategoryCard from "../components/card/CategoryCard.tsx";
import CategorySkeleton from "../components/skeleton/CategorySkeleton.tsx";
import AddCategoryModal from "../components/modal/AddCategoryModal.tsx";
import EditCategoryModal from "../components/modal/EditCategoryModal.tsx";
import ConfirmModal from "../components/modal/ConfirmModal.tsx";
import {strings} from "../utils/localization.ts";
import {useLanguage} from "../utils/LanguageContext.tsx";

export default function CategoriesPage() {

	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [loading, setLoading] = useState(true);

	useLanguage();

	useEffect(() => {
		async function loadCategories() {
			setLoading(true);

			try {
				const data =
					await getCategories();

				setCategories(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		loadCategories();

	}, []);

	async function handleDeleteCategory(id: number) {

		try {
			await deleteCategory(id);

			setCategories((prev) => prev.filter((x) => x.id !== id));
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
							{strings.categories_title}
						</h1>

						<p className="text-zinc-600">
							{strings.categories.hint}
						</p>

					</div>

					<button
						onClick={() =>
							setShowAddModal(true)
						}
						className="
                            bg-black
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                        "
					>
						{strings.categories.add_label}
					</button>

				</div>

				<div className="space-y-3">

					{loading ? (

						Array.from({length: 4}).map(
							(_, index) => (
								<CategorySkeleton
									key={index}
								/>
							)
						)

					) : (

						categories.map((category) => (

							<CategoryCard
								key={category.id}
								category={category}

								onEdit={() => {

									setSelectedCategory(
										category
									);

									setShowEditModal(
										true
									);
								}}

								onDelete={() => {

									setSelectedCategory(
										category
									);

									setShowDeleteModal(
										true
									);
								}}
							/>

						))

					)}

				</div>

			</div>

			<AddCategoryModal
				open={showAddModal}
				onClose={() =>
					setShowAddModal(false)
				}
				onCreated={(category) => {

					setCategories((prev) => [

						category,

						...prev

					]);
				}}
			/>

			<EditCategoryModal
				open={showEditModal}
				category={selectedCategory}
				onClose={() => {

					setShowEditModal(false);

					setSelectedCategory(null);
				}}
				onUpdated={(updated) => {

					setCategories((prev) =>
						prev.map((x) => {

							if (
								x.id !== updated.id
							) {
								return x;
							}

							return updated;
						})
					);
				}}
			/>

			<ConfirmModal
				open={showDeleteModal}
				title={strings.categories.delete_title}
				message={strings.categories.delete_confirm}
				confirmText={strings.delete_button}
				onClose={() => {
					setShowDeleteModal(false);
					setSelectedCategory(null);
				}}
				onConfirm={() => {

					if (!selectedCategory) {
						return;
					}

					handleDeleteCategory(
						selectedCategory.id
					).then(() => {

						setShowDeleteModal(false);

						setSelectedCategory(null);
					});
				}}
			/>

		</AdminLayout>
	);
}