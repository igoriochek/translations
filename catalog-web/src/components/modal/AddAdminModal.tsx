import {useState} from "react";

import Modal from "./Modal";

import type {User} from "../../api/types.ts";

import {createAdmin} from "../../api/users.ts";
import {strings} from "../../utils/localization.ts";

interface AddAdminModalProps {
	open: boolean;

	onClose: () => void;

	onCreated: (admin: User) => void;
}

export default function AddAdminModal({
										  open,

										  onClose,

										  onCreated
									  }: AddAdminModalProps) {

	const [name, setName] =
		useState('');

	const [email, setEmail] =
		useState('');

	const [password, setPassword] =
		useState('');

	const [confirmPassword, setConfirmPassword] =
		useState('');

	const [loading, setLoading] =
		useState(false);

	async function handleSubmit() {

		if (
			!name.trim() ||
			!email.trim() ||
			!password.trim()
		) {
			return;
		}

		if (password !== confirmPassword) {
			return;
		}

		try {

			setLoading(true);

			if(password !== confirmPassword)
				throw new Error("Passwords don't match");

			const admin = await createAdmin(
				name,
				email,
				password
			);

			onCreated(admin);

			setName('');
			setEmail('');
			setPassword('');
			setConfirmPassword('');

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
			title={strings.admins.add_label}
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
						{strings.admins.name_field}
					</label>

					<input
						autoFocus

						type="text"

						value={name}

						onChange={(e) =>
							setName(e.target.value)
						}

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

				<div>

					<label
						className="
                            block
                            mb-1
                            text-sm
                            font-medium
                        "
					>
						{strings.admins.email_field}
					</label>

					<input
						type="email"

						value={email}

						onChange={(e) =>
							setEmail(e.target.value)
						}

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

				<div>

					<label
						className="
                            block
                            mb-1
                            text-sm
                            font-medium
                        "
					>
						{strings.admins.password_field}
					</label>

					<input
						type="password"

						value={password}

						onChange={(e) =>
							setPassword(e.target.value)
						}

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

				<div>

					<label
						className="
                            block
                            mb-1
                            text-sm
                            font-medium
                        "
					>
						{strings.admins.confirm_field}
					</label>

					<input
						type="password"

						value={confirmPassword}

						onChange={(e) =>
							setConfirmPassword(
								e.target.value
							)
						}

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

				{password !== confirmPassword &&
					confirmPassword.length > 0 && (

						<p
							className="
                            text-sm
                            text-red-500
                        "
						>
							{strings.admins.passwords_different}
						</p>
					)}

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

						disabled={
							loading ||
							password !== confirmPassword
						}

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
							: strings.save_button}

					</button>

				</div>

			</div>

		</Modal>
	);
}