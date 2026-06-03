import {useEffect, useState} from "react";
import AdminLayout from "../layouts/AdminLayout";
import type {Ingredient} from "../api/types.ts";
import {deleteIngredient, getIngredients} from "../api/ingredients.ts";
import IngredientCard from "../components/card/IngredientCard.tsx";
import IngredientSkeleton from "../components/skeleton/IngredientSkeleton.tsx";
import AddIngredientModal from "../components/modal/AddIngredientModal.tsx";
import EditIngredientModal from "../components/modal/EditIngredientModal.tsx";
import ConfirmModal from "../components/modal/ConfirmModal.tsx";

export default function IngredientsPage() {
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadIngredients() {
			setLoading(true);

			try {
				const data = await getIngredients();
				setIngredients(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		loadIngredients();

	}, []);

	async function handleDeleteIngredient(id: number) {

		try {
			await deleteIngredient(id);

			setIngredients((prev) => prev.filter((x) => x.id !== id));

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
							Ingredients
						</h1>

						<p className="text-zinc-600">
							Manage localized
							product ingredients.
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
						Add Ingredient
					</button>

				</div>

				<div className="space-y-3">

					{loading ? (

						Array.from({length: 4}).map(
							(_, index) => (
								<IngredientSkeleton
									key={index}
								/>
							)
						)

					) : (

						ingredients.map((ingredient) => (

							<IngredientCard
								key={ingredient.id}
								ingredient={ingredient}

								onEdit={() => {

									setSelectedIngredient(
										ingredient
									);

									setShowEditModal(
										true
									);
								}}

								onDelete={() => {

									setSelectedIngredient(
										ingredient
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

			<AddIngredientModal
				open={showAddModal}

				onClose={() =>
					setShowAddModal(false)
				}

				onCreated={(ingredient) => {

					setIngredients((prev) => [

						ingredient,

						...prev

					]);
				}}
			/>

			<EditIngredientModal
				open={showEditModal}

				ingredient={selectedIngredient}

				onClose={() => {

					setShowEditModal(false);

					setSelectedIngredient(null);
				}}

				onUpdated={(updated) => {

					setIngredients((prev) =>
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

				title="Delete Ingredient"

				message={
					`Are you sure you want to delete this ingredient?`
				}

				confirmText="Delete"

				onClose={() => {

					setShowDeleteModal(false);

					setSelectedIngredient(null);
				}}

				onConfirm={() => {

					if (!selectedIngredient) {
						return;
					}

					handleDeleteIngredient(
						selectedIngredient.id
					).then(() => {

						setShowDeleteModal(false);

						setSelectedIngredient(null);
					});
				}}
			/>

		</AdminLayout>
	);
}