import {useState} from "react";

import type {
	Recipe,
	RecipeRequest
} from "../../api/types.ts";

import {createRecipe}
	from "../../api/recipes.ts";

import RecipeForm
	from "../RecipeForm.tsx";
import {strings} from "../../utils/localization.ts";

interface AddRecipeModalProps {
	open: boolean;

	onClose: () => void;

	onCreated: (
		recipe: Recipe
	) => void;
}

export default function AddRecipeModal({
										   open,
										   onClose,
										   onCreated
									   }: AddRecipeModalProps) {

	const [loading, setLoading] =
		useState(false);

	if (!open)
		return null;

	async function handleSubmit(
		request: RecipeRequest
	) {
		try {
			setLoading(true);

			const recipe =
				await createRecipe(
					request
				);

			onCreated(recipe);
			onClose();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl flex flex-col max-h-[90vh]">
				<h2 className="text-xl font-bold mb-6">
					{strings.recipes.add_label}
				</h2>

				<RecipeForm
					loading={loading}
					submitText={strings.create_button}
					onSubmit={handleSubmit}
					onCancel={onClose}
				/>
			</div>

		</div>
	);
}