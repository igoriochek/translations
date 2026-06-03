import { useEffect, useState } from "react";
import type { NutritionalType, Language, TranslationInput } from "../../api/types.ts";
import { getLanguages } from "../../api/languages.ts";
import { createNutritionalType } from "../../api/nutritionalTypes.ts";
import TranslationInputs from "../TranslationInputs.tsx";

interface AddNutritionalTypeModalProps {
	open: boolean;
	onClose: () => void;
	onCreated: (nutritionalType: NutritionalType) => void;
}

export default function AddNutritionalTypeModal({ open, onClose, onCreated }: AddNutritionalTypeModalProps) {
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

			const nutritionalType =
				await createNutritionalType(
					translations
				);

			onCreated(nutritionalType);

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
						Add Nutritional Type
					</h2>

					<p
						className="
                            text-sm
                            text-zinc-500
                            mt-1
                        "
					>
						Create localized
						nutritional type translations.
					</p>

				</div>

				<TranslationInputs
					languages={languages}
					translations={translations}
					onChange={setTranslations}
					label="Nutritional Type Names"
					placeholder="Enter nutritional type name"
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
							? 'Creating...'
							: 'Create'}

					</button>

				</div>

			</div>

		</div>
	);
}