import {useEffect, useState} from "react";

import type {Certification} from "../../api/types.ts";

import {strings} from "../../utils/localization.ts";
import {updateCertification} from "../../api/certifications.ts";

interface EditCertificationModalProps {
	open: boolean;

	certification: Certification | null;

	onClose: () => void;

	onUpdated: (
		certification: Certification
	) => void;
}

export default function EditCertificationModal({
											  open,
											  certification,
											  onClose,
											  onUpdated
										  }: EditCertificationModalProps) {

	const [label, setLabel] =
		useState('');
	const [imageToUpload, setImageToUpload] =
		useState<File | null>(null);

	const [error, setError] =
		useState<string | null>(null);

	const [loading, setLoading] =
		useState(false);

	useEffect(() => {
		function loadFields(c: Certification) {
			setLabel(c.label);
			setImageToUpload(null);
			setError("");
		}

		if (!certification) {
			return;
		}

		loadFields(certification);
	}, [certification]);

	if (!open || !certification) {
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

		try {
			setLoading(true);

			const updatedCert =
				await updateCertification(
					{
						...certification!,
						label
					}, imageToUpload ?? undefined
				);

			onUpdated(updatedCert);
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
						{strings.certifications.edit_label}
					</h2>

					<p
						className="
                            text-sm
                            text-zinc-500
                            mt-1
                        "
					>
						{strings.certifications.edit_hint}
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

						<div className="relative">
							<img
								src={imageToUpload ? URL.createObjectURL(imageToUpload) : certification.badge_url}
								alt=""
								className="w-full aspect-square object-cover rounded-xl border border-zinc-200"
							/>

							{imageToUpload &&
								<button
									onClick={() => setImageToUpload(null)}
									className="absolute text-xl top-2 right-2 bg-white rounded-full w-8 h-8 shadow text-red-500"
								>
									×
								</button>
							}
						</div>

						{error &&
							<p className="text-red-500">
								{error}
							</p>
						}
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