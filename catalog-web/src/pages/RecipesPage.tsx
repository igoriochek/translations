import {useEffect, useState} from "react";
import AdminLayout from "../layouts/AdminLayout";

import type {Recipe} from "../api/types.ts";

import {
	deleteRecipe,
	getRecipes
} from "../api/recipes.ts";

import RecipeCard from "../components/card/RecipeCard.tsx";
import RecipeSkeleton from "../components/skeleton/RecipeSkeleton.tsx";

import AddRecipeModal from "../components/modal/AddRecipeModal.tsx";
import EditRecipeModal from "../components/modal/EditRecipeModal.tsx";
import ConfirmModal from "../components/modal/ConfirmModal.tsx";

export default function RecipesPage() {

	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadRecipes() {

			setLoading(true);

			try {

				const data = await getRecipes();

				setRecipes(data);

			} catch (err) {

				console.error(err);

			} finally {

				setLoading(false);
			}
		}

		loadRecipes();

	}, []);

	async function handleDeleteRecipe(id: number) {

		try {

			await deleteRecipe(id);

			setRecipes(
				(prev) =>
					prev.filter(
						(x) => x.id !== id
					)
			);

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
							Recipes
						</h1>

						<p className="text-zinc-600">
							Manage localized recipes and product associations.
						</p>

					</div>

					<button
						onClick={() => setShowAddModal(true)}
						className="bg-black text-white px-4 py-2 rounded-lg text-sm"
					>
						Add Recipe
					</button>

				</div>

				<div className="space-y-3">

					{loading ? (

						Array.from({length: 4}).map(
							(_, index) =>
								<RecipeSkeleton key={index}/>
						)

					) : (

						recipes.map((recipe) => (

							<RecipeCard
								key={recipe.id}
								recipe={recipe}

								onEdit={() => {
									setSelectedRecipe(recipe);
									setShowEditModal(true);
								}}

								onDelete={() => {
									setSelectedRecipe(recipe);
									setShowDeleteModal(true);
								}}
							/>

						))

					)}

				</div>

			</div>

			<AddRecipeModal
				open={showAddModal}
				onClose={() => setShowAddModal(false)}
				onCreated={(recipe) => {
					setRecipes((prev) => [
						...prev,
						recipe
					]);
				}}
			/>

			<EditRecipeModal
				open={showEditModal}
				recipe={selectedRecipe}
				onClose={() => {
					setShowEditModal(false);
					setSelectedRecipe(null);
				}}
				onUpdated={(updated) => {

					setRecipes(
						(prev) =>
							prev.map((x) => {

								if (x.id !== updated.id)
									return x;

								return updated;
							})
					);

				}}
			/>

			<ConfirmModal
				open={showDeleteModal}
				title="Delete Recipe"
				message="Are you sure you want to delete this recipe?"
				confirmText="Delete"

				onClose={() => {
					setShowDeleteModal(false);
					setSelectedRecipe(null);
				}}

				onConfirm={() => {

					if (!selectedRecipe)
						return;

					handleDeleteRecipe(
						selectedRecipe.id
					).then(() => {

						setShowDeleteModal(false);
						setSelectedRecipe(null);

					});

				}}
			/>

		</AdminLayout>
	);
}