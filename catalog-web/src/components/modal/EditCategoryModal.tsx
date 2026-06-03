import {useEffect, useState} from "react";

import type {
	Category,
	Language,
	TranslationInput
} from "../../api/types.ts";

import {getLanguages} from "../../api/languages.ts";
import {updateCategory} from "../../api/categories.ts";

import TranslationInputs from "../TranslationInputs.tsx";

interface EditCategoryModalProps {
	open: boolean;

	category: Category | null;

	onClose: () => void;

	onUpdated: (category: Category) => void;
}

export default function EditCategoryModal({
											  open,
											  category,
											  onClose,
											  onUpdated
										  }: EditCategoryModalProps) {

	const [languages, setLanguages] =
		useState<Language[]>([]);

	const [translations, setTranslations] =
		useState<TranslationInput[]>([]);

	const [loading, setLoading] =
		useState(false);

	useEffect(() => {

		if (!open || !category) {
			return;
		}

		async function loadLanguages() {

			try {

				const data =
					await getLanguages();

				setLanguages(data);

				setTranslations(
					data.map((language) => {

						const existing =
							category!.names.find(
								(x) =>
									x.language.id ===
									language.id
							);

						return {
							language_id: language.id,

							value:
								existing?.name ?? ''
						};
					})
				);

			} catch (err) {

				console.error(err);
			}
		}

		loadLanguages();

	}, [open, category]);

	if (!open || !category) {
		return null;
	}

	async function handleSubmit() {

		const invalid =
			translations.some(
				(x) => !x.value.trim()
			);

		if (invalid) {
			return;
		}

		try {

			setLoading(true);

			const updated =
				await updateCategory(
					category!.id,
					translations
				);

			onUpdated(updated);

			onClose();

		} catch (err) {

			console.error(err);

		} finally {

			setLoading(false);
		}
	}

	return (
		<div
			className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                backdrop-blur-sm
                p-4
            "
		>

			<div
				className="
                    w-full
                    max-w-2xl
                    bg-white
                    rounded-2xl
                    shadow-xl
                    p-6
                    space-y-6
                "
			>

				<div>

					<h2
						className="
                            text-xl
                            font-bold
                        "
					>
						Edit Category
					</h2>

					<p
						className="
                            text-sm
                            text-zinc-500
                            mt-1
                        "
					>
						Update category translations.
					</p>

				</div>

				<TranslationInputs
					languages={languages}
					translations={translations}
					onChange={setTranslations}
					label="Category Names"
					placeholder="Enter category name"
				/>

				<div
					className="
                        flex
                        justify-end
                        gap-3
                    "
				>

					<button
						onClick={onClose}
						disabled={loading}
						className="
                            px-4
                            py-2
                            rounded-xl
                            border
                            border-zinc-200
                            text-sm
                        "
					>
						Cancel
					</button>

					<button
						onClick={handleSubmit}
						disabled={loading}
						className="
                            px-4
                            py-2
                            rounded-xl
                            bg-black
                            text-white
                            text-sm
                        "
					>

						{loading
							? 'Saving...'
							: 'Save'}

					</button>

				</div>

			</div>

		</div>
	);
}