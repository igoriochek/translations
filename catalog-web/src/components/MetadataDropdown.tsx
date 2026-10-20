import {useState} from "react";

import {Link} from "react-router-dom";

import {ChevronDown} from "lucide-react";
import {strings} from "../utils/localization.ts";

export default function MetadataDropdown() {

	const [open, setOpen] =
		useState(false);

	return (
		<div className="relative">

			<button
				onClick={() =>
					setOpen((prev) => !prev)
				}
				className="
                    flex
                    items-center
                    gap-1
                    text-sm
                    text-zinc-700
                    hover:text-black
                    transition
                "
			>
				{strings.metadata_title}

				<ChevronDown size={16}/>

			</button>

			{open && (

				<div
					className="
                        absolute
                        top-full
                        left-0
                        mt-2
                        w-56
                        bg-white
                        rounded-xl
                        border
                        border-zinc-100
                        shadow-lg
                        overflow-hidden
                        z-50
                    "
				>

					<div className="py-2">

						<Link
							to="/categories"
							className="
                                block
                                px-4
                                py-2
                                text-sm
                                text-zinc-700
                                hover:bg-zinc-50
                            "
							onClick={() =>
								setOpen(false)
							}
						>
							{strings.categories_title}
						</Link>

						<Link
							to="/allergens"
							className="
                                block
                                px-4
                                py-2
                                text-sm
                                text-zinc-700
                                hover:bg-zinc-50
                            "
							onClick={() =>
								setOpen(false)
							}
						>
							{strings.allergens_title}
						</Link>

						<Link
							to="/nutritional-types"
							className="
                                block
                                px-4
                                py-2
                                text-sm
                                text-zinc-700
                                hover:bg-zinc-50
                            "
							onClick={() =>
								setOpen(false)
							}
						>
							{strings.nutritional_types_title}
						</Link>

						<Link
							to="/languages"
							className="
                                block
                                px-4
                                py-2
                                text-sm
                                text-zinc-700
                                hover:bg-zinc-50
                            "
							onClick={() =>
								setOpen(false)
							}
						>
							{strings.languages_title}
						</Link>
						
						<Link
							to="/ingredients"
							className="
                                block
                                px-4
                                py-2
                                text-sm
                                text-zinc-700
                                hover:bg-zinc-50
                            "
							onClick={() =>
								setOpen(false)
							}
						>
							{strings.ingredients_title}
						</Link>
					</div>

				</div>

			)}

		</div>
	);
}