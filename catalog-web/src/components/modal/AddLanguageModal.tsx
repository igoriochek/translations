import {useState} from "react";

import type {Language} from "../../api/types.ts";

import {createLanguage}
	from "../../api/languages.ts";

interface AddLanguageModalProps {
	open: boolean;

	onClose: () => void;

	onCreated: (
		language: Language
	) => void;
}

export default function AddLanguageModal({
											 open,

											 onClose,

											 onCreated
										 }: AddLanguageModalProps) {

	const [name, setName] =
		useState('');

	const [code, setCode] =
		useState('');

	const [loading, setLoading] =
		useState(false);

	if (!open) {
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

			const language =
				await createLanguage(name, code);

			onCreated(language);

			setName('');
			setCode('');

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
						Add Language
					</h2>

					<p
						className="
                            text-sm
                            text-zinc-500
                            mt-1
                        "
					>
						Create a supported language.
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

							placeholder="English"

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

							placeholder="en"

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
							? 'Creating...'
							: 'Create'}

					</button>

				</div>

			</div>

		</div>
	);
}