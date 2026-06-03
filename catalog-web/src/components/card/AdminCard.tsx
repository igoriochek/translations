import type {User} from "../../api/types.ts";

import {Trash2} from "lucide-react";

interface AdminCardProps {
	admin: User;

	onDelete?: () => void;
}

export default function AdminCard({
									  admin,

									  onDelete
								  }: AdminCardProps) {

	return (
		<div
			className="
                bg-white
                rounded-xl
                border border-zinc-100
                shadow-sm
                px-5
                py-4
            "
		>

			<div className="flex items-center justify-between">

				<div>

					<h2 className="font-semibold">
						{admin.name}
					</h2>

					<p
						className="
                            text-sm
                            text-zinc-500
                            mt-1
                        "
					>
						{admin.email}
					</p>

				</div>

				<button
					onClick={onDelete}
					className="
                        text-zinc-500
                        hover:text-red-500
                        transition
                    "
				>

					<Trash2 size={18}/>

				</button>

			</div>

		</div>
	);
}