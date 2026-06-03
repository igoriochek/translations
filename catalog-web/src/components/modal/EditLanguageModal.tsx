import {useEffect, useState} from "react";

import type {Language} from "../../api/types.ts";

import {updateLanguage}
	from "../../api/languages.ts";

interface EditLanguageModalProps {
	open: boolean;

	language: Language | null;

	onClose: () => void;

	onUpdated: (
		language: Language
	) => void;
}

export default function EditLanguageModal({
											  open,

											  language,

											  onClose,

											  onUpdated
										  }: EditLanguageModalProps) {

	const [name, setName] =
		useState('');

	const [code, setCode] =
		useState('');

	const [loading, setLoading] =
		useState(false);

	useEffect(() => {
		function loadFields(l: Language) {
			setName(l.name);
			setCode(l.code);
		}

		if (!language) {
			return;
		}

		loadFields(language);
	}, [language]);

	if (!open || !language) {
		return null;
	}

	async function handleSubmit() {

		if (!name.trim()) {
			return;
		}

		if (!code.trim()) {
			return;
		}

		try {

			setLoading(true);

			const updatedLanguage =
				await updateLanguage(
					{
						...language!,
						name,
						code
					}
				);

			onUpdated(updatedLanguage);

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
                    max-w-md
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
						Edit Language
					</h2>

					<p
						className="
                            text-sm
                            text-zinc-500
                            mt-1
                        "
					>
						Modify language information.
					</p>

				</div>

				<div className="space-y-4">

					<div className="space-y-2">

						<label
							className="
                                text-sm
                                font-medium
                            "
						>
							Name
						</label>

						<input
							type="text"

							value={name}

							onChange={(e) =>
								setName(
									e.target.value
								)
							}

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

					</div>

					<div className="space-y-2">

						<label
							className="
                                text-sm
                                font-medium
                            "
						>
							Language Code
						</label>

						<input
							type="text"

							value={code}

							onChange={(e) =>
								setCode(
									e.target.value
										.toLowerCase()
								)
							}

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

					</div>

				</div>

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