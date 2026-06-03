import type {Language, TranslationInput} from "../api/types.ts";

interface TranslationInputsProps {
	languages: Language[];
	translations: TranslationInput[];
	onChange: (translations: TranslationInput[]) => void;
	label?: string;
	placeholder?: string;
	multiline?: boolean;
}

export default function TranslationInputs({
											  languages,
											  translations,
											  onChange,
											  label = 'Translations',
											  placeholder = 'Enter translation',
											  multiline = false
										  }: TranslationInputsProps) {

	function updateTranslation(
		languageId: number,
		value: string
	) {

		const updated =
			translations.map((translation) => {

				if (
					translation.language_id !==
					languageId
				) {
					return translation;
				}

				return {
					...translation,

					value
				};
			});

		onChange(updated);
	}

	return (
		<div className="space-y-4">

			<div>

				<h3
					className="
                        text-sm
                        font-medium
                    "
				>
					{label}
				</h3>

			</div>

			<div className="space-y-3">

				{languages.map((language) => {

					const translation =
						translations.find((x) => x.language_id === language.id);

					return (

						<div
							key={language.id}
							className="
                                grid
                                grid-cols-[140px_1fr]
                                gap-3
                                items-center
                            "
						>

							<div
								className="
                                    text-sm
                                    text-zinc-600
                                "
							>

								{language.name}

								<span
									className="
                                        text-zinc-400
                                        ml-1
                                    "
								>
                                    ({language.code})
                                </span>

							</div>

							{multiline ? (
								<textarea
									value={translation?.value ?? ''}
									onChange={(e) =>
										updateTranslation(language.id, e.target.value)
									}
									placeholder={placeholder}
									className="
										w-full
										border
										border-zinc-200
										rounded-xl
										px-4
										py-3
										outline-none
										focus:ring-2
										focus:ring-black/5
									"
								/>
							) : (
								<input
									type="text"
									value={translation?.value ?? ''}
									onChange={(e) =>
										updateTranslation(language.id, e.target.value)
									}
									placeholder={placeholder}
									className="
										w-full
										border
										border-zinc-200
										rounded-xl
										px-4
										py-3
										outline-none
										focus:ring-2
										focus:ring-black/5
									"
								/>
							)}
						</div>
					);
				})}

			</div>

		</div>
	);
}