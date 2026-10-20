import {useState} from "react";

import Modal from "./Modal";

import type {SellerStore} from "../../api/types.ts";

import {createStore} from "../../api/sellers.ts";
import {strings} from "../../utils/localization.ts";

interface AddStoreModalProps {
	open: boolean;
	sellerId: number;
	onClose: () => void;
	onCreated: (store: SellerStore) => void;
}

export default function AddStoreModal({
										  open,
										  sellerId,
										  onClose,
										  onCreated
									  }: AddStoreModalProps) {

	const [location, setLocation] =
		useState('');

	const [loading, setLoading] =
		useState(false);

	async function handleSubmit() {

		if (!location.trim()) {
			return;
		}

		try {
			setLoading(true);

			const store = await createStore(
				sellerId,
				location
			);
			onCreated(store);

			setLocation('');
			onClose();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Modal
			open={open}
			title={strings.sellers.add_store_label}
			onClose={onClose}
		>

			<div className="space-y-4">

				<div>

					<label
						className="
                            block
                            mb-1
                            text-sm
                            font-medium
                        "
					>
						{strings.sellers.location_field}
					</label>

					<input
						autoFocus
						type="text"
						value={location}
						onChange={(e) =>
							setLocation(e.target.value)
						}
						placeholder={strings.sellers.location_placeholder}
						className="
                            w-full
                            border
                            border-zinc-300
                            rounded-lg
                            px-3
                            py-2
                        "
					/>

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
                            rounded-lg
                            border
                            border-zinc-300
                            text-sm
                        "
					>
						{strings.cancel_button}
					</button>

					<button
						onClick={handleSubmit}
						disabled={loading}
						className="
                            bg-black
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                            disabled:opacity-50
                        "
					>

						{loading
							? strings.saving
							: strings.add_button}

					</button>

				</div>

			</div>

		</Modal>
	);
}