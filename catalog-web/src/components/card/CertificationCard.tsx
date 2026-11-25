import type {Certification} from "../../api/types.ts";

import {Pencil, Trash2} from "lucide-react";

interface CertificationCardProps {
	certification: Certification;

	onEdit?: () => void;
	onDelete?: () => void;
}

export default function CertificationCard({
										 certification,

										 onEdit,
										 onDelete
									 }: CertificationCardProps) {

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

				<div className="flex flex-row gap-3 items-center">
					<img
						className="
                            h-16
                            mt-1
                        "
						src={certification.badge_url}
						alt={certification.label}
					/>

					<h2 className="font-semibold">
						{certification.label}
					</h2>
				</div>

				<div className="flex items-center gap-3">

					<button
						onClick={onEdit}
						className="
                            text-zinc-500
                            hover:text-black
                            transition
                        "
					>

						<Pencil size={18}/>

					</button>

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

		</div>
	);
}