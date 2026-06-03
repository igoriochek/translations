import {useEffect, useState} from "react";
import type {Allergen, Language, TranslationInput} from "../../api/types.ts";
import {getLanguages} from "../../api/languages.ts";
import {updateAllergen} from "../../api/allergens.ts";
import TranslationInputs from "../TranslationInputs.tsx";

interface EditAllergenModalProps {
	open: boolean;
	allergen: Allergen | null;
	onClose: () => void;
	onUpdated: (allergen: Allergen) => void;
}

export default function EditAllergenModal({open, allergen, onClose, onUpdated}: EditAllergenModalProps) {

	const [languages, setLanguages] = useState<Language[]>([]);
	const [translations, setTranslations] = useState<TranslationInput[]>([]);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open || !allergen) {
			return;
		}

		async function loadLanguages() {
			try {
				const data = await getLanguages();
				setLanguages(data);

				setTranslations(data.map((language) => {
						const existing =
							allergen!.names.find((x) => x.language.id === language.id);

						return {
							language_id: language.id,
							value: existing?.name ?? ''
						};
					})
				);
			} catch (err) {
				console.error(err);
			}
		}

		loadLanguages();
	}, [open, allergen]);

	if (!open || !allergen) {
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
				await updateAllergen(
					allergen!.id,
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
						Edit Allergen
					</h2>

					<p
						className="
                            text-sm
                            text-zinc-500
                            mt-1
                        "
					>
						Update allergen translations.
					</p>

				</div>

				<TranslationInputs
					languages={languages}
					translations={translations}
					onChange={setTranslations}
					label="Allergen Names"
					placeholder="Enter allergen name"
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