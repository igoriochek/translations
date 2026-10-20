import { useEffect, useState } from "react";
import type { Ingredient, Language, TranslationInput } from "../../api/types.ts";
import { getLanguages } from "../../api/languages.ts";
import { createIngredient } from "../../api/ingredients.ts";
import TranslationInputs from "../TranslationInputs.tsx";
import {strings} from "../../utils/localization.ts";

interface AddIngredientModalProps {
	open: boolean;
	onClose: () => void;
	onCreated: (ingredient: Ingredient) => void;
}

export default function AddIngredientModal({ open, onClose, onCreated }: AddIngredientModalProps) {
	const [languages, setLanguages] = useState<Language[]>([]);
	const [translations, setTranslations] = useState<TranslationInput[]>([]);

	const [loading, setLoading] = useState(false);

	useEffect(() => {

		if (!open) {
			return;
		}

		async function loadLanguages() {

			try {

				const data =
					await getLanguages();

				setLanguages(data);

				setTranslations(
					data.map((language) => ({
						language_id: language.id,

						value: ''
					}))
				);

			} catch (err) {

				console.error(err);
			}
		}

		loadLanguages();

	}, [open]);

	if (!open) {
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

			const ingredient =
				await createIngredient(
					translations
				);

			onCreated(ingredient);

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
						{strings.ingredients.add_label}
					</h2>

					<p
						className="
                            text-sm
                            text-zinc-500
                            mt-1
                        "
					>
						{strings.ingredients.add_hint}
					</p>

				</div>

				<TranslationInputs
					languages={languages}
					translations={translations}
					onChange={setTranslations}
					label={strings.ingredients.translations_label}
					placeholder={strings.ingredients.translations_placeholder}
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
						{strings.cancel_button}
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
							? strings.saving
							: strings.create_button}

					</button>

				</div>

			</div>

		</div>
	);
}