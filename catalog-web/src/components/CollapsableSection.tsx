import type {ReactNode} from "react";

import {ChevronDownIcon, ChevronRightIcon, PlusIcon} from "lucide-react";
import {strings} from "../utils/localization.ts";

interface CollapsableSectionProps {
	title: string;
	addLabel?: string;
	expanded: boolean;
	onToggle: () => void;
	onAdd?: () => void;
	icon?: ReactNode;
	children: ReactNode;
}

export default function CollapsableSection({
											   title,
											   addLabel = strings.add_button,
											   expanded,
											   onToggle,
											   onAdd,
											   icon = <PlusIcon size={15}/>,
											   children
										   }: CollapsableSectionProps) {

	return (
		<div className="border-2 rounded-lg p-3 border-zinc-100 shadow-sm">

			<div
				className="
                    flex
                    items-center
                    justify-between
                "
			>

				<button
					onClick={onToggle}
					className="
                        flex
                        items-center
                        gap-2
                        text-left
                        font-semibold
                        text-zinc-900
                        flex-1
                    "
				>

					{expanded ? (
						<ChevronDownIcon size={18}/>
					) : (
						<ChevronRightIcon size={18}/>
					)}

					<span>
                        {title}
                    </span>

				</button>

				{onAdd && (

					<button
						onClick={onAdd}
						className="
                            flex
                            items-center
                            gap-1
                            text-sm
                            text-zinc-500
                            hover:text-zinc-900
                            transition-colors
                        "
					>

						{icon}

						<span>
                            {addLabel}
                        </span>

					</button>
				)}

			</div>

			{expanded && (

				<div
					className="
                        pt-2
                        space-y-4
                    "
				>
					{children}

				</div>
			)}

		</div>
	);
}