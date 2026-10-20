import {useEffect, useState} from "react";
import type {NutritionalType, Language, TranslationInput} from "../../api/types.ts";
import {getLanguages} from "../../api/languages.ts";
import {updateNutritionalType} from "../../api/nutritionalTypes.ts";
import TranslationInputs from "../TranslationInputs.tsx";
import {strings} from "../../utils/localization.ts";

interface EditNutritionalTypeModalProps {
	open: boolean;
	nutritionalType: NutritionalType | null;
	onClose: () => void;
	onUpdated: (nutritionalType: NutritionalType) => void;
}

export default function EditNutritionalTypeModal({open, nutritionalType, onClose, onUpdated}: EditNutritionalTypeModalProps) {

	const [languages, setLanguages] = useState<Language[]>([]);
	const [translations, setTranslations] = useState<TranslationInput[]>([]);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open || !nutritionalType) {
			return;
		}

		async function loadLanguages() {
			try {
				const data = await getLanguages();
				setLanguages(data);

				setTranslations(data.map((language) => {
						const existing =
							nutritionalType!.labels.find((x) => x.language.id === language.id);

						return {
							language_id: language.id,
							value: existing?.label ?? ''
						};
					})
				);
			} catch (err) {
				console.error(err);
			}
		}

		loadLanguages();
	}, [open, nutritionalType]);

	if (!open || !nutritionalType) {
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
				await updateNutritionalType(
					nutritionalType!.id,
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
						{strings.nutritional_types.edit_label}
					</h2>

					<p
						className="
                            text-sm
                            text-zinc-500
                            mt-1
                        "
					>
						{strings.nutritional_types.edit_hint}
					</p>

				</div>

				<TranslationInputs
					languages={languages}
					translations={translations}
					onChange={setTranslations}
					label={strings.nutritional_types.translations_label}
					placeholder={strings.nutritional_types.translations_placeholder}
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
							: strings.save_button}

					</button>

				</div>

			</div>

		</div>
	);
}