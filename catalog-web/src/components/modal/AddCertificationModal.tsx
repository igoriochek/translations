import {useState} from "react";

import type {Certification} from "../../api/types.ts";

import {strings} from "../../utils/localization.ts";
import {createCertification} from "../../api/certifications.ts";

interface AddCertificationModalProps {
	open: boolean;

	onClose: () => void;

	onCreated: (
		certification: Certification
	) => void;
}

export default function AddCertificationModal({
											 open,
											 onClose,
											 onCreated
										 }: AddCertificationModalProps) {

	const [label, setLabel] =
		useState('');
	const [imageToUpload, setImageToUpload] =
		useState<File | null>(null);

	const [error, setError] =
		useState<string | null>(null);
	const [loading, setLoading] =
		useState(false);

	if (!open) {
		return null;
	}

	function updateImage(event: React.ChangeEvent<HTMLInputElement>) {
		if (!event.target.files)
			return;

		setImageToUpload(event.target.files[0]);
		event.target.value = '';
	}

	async function handleSubmit() {
		setError("");

		if (!label.trim())
			return setError(strings.certifications.missing_label);

		if(!imageToUpload)
			return setError(strings.certifications.missing_image);

		try {
			setLoading(true);

			const cert =
				await createCertification(label, imageToUpload);

			onCreated(cert);

			setLabel('');
			setImageToUpload(null);

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
						{strings.certifications.add_label}
					</h2>

					<p
						className="
                            text-sm
                            text-zinc-500
                            mt-1
                        "
					>
						{strings.certifications.add_hint}
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
							{strings.certifications.label_field}
						</label>

						<input
							type="text"
							value={label}
							onChange={(e) =>
								setLabel(
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

					<label
						className="
							flex
							items-center
							justify-center
							border-2
							border-dashed
							border-zinc-200
							rounded-xl
							p-8
							cursor-pointer
							hover:bg-zinc-50"
					>
						<input type="file" accept="image/*" className="hidden" onChange={updateImage}/>
						<span>{strings.certifications.upload_image_button}</span>
					</label>

					{imageToUpload &&
						<div className="relative">
							<img
								src={URL.createObjectURL(imageToUpload)}
								alt=""
								className="w-full aspect-square object-cover rounded-xl border border-zinc-200"
							/>
						</div>
					}

					{error &&
						<p className="text-red-500">
							{error}
						</p>
					}

				</div>

				<div
					className="
                        flex
                        justify-end
                        gap-3
                    "
				>

					<button
						onClick={() => {setError(""); onClose()}}
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