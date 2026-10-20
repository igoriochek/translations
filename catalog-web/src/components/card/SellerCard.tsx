import type {SellerListItem} from "../../api/types.ts";
import {Pencil, Trash2} from "lucide-react";
import {strings} from "../../utils/localization.ts";

interface SellerCardProps {
    seller: SellerListItem;
    selected?: boolean;
    loading?: boolean;

    onEdit?: () => void;
    onDelete?: () => void;
}

export default function SellerCard({
                                       seller,
                                       selected = false,
                                       loading = false,

                                       onEdit,
                                       onDelete
                                   }: SellerCardProps) {

    return (
        <div
            className={`
                bg-white
                rounded-xl
                border
                shadow-sm
                p-5

                ${
                selected
                    ? "border-zinc-400"
                    : "border-zinc-200"
            }
            `}
        >

            <div className="flex items-start justify-between">

                <div>

                    <h2 className="font-semibold text-lg">
                        {seller.name}
                    </h2>

                    <div className="mt-2 space-y-1">

                        <p className="text-sm text-zinc-500">
                            {seller.stores_count}
                            {' '}
                            {seller.stores_count == 1 ?
                                strings.sellers.store.toLowerCase() :
                                strings.sellers.stores.toLowerCase()}
                        </p>

                        <p className="text-sm text-zinc-500">
                            {seller.products_count}
                            {' '}
                            {seller.products_count == 1 ?
                                strings.products.product.toLowerCase() :
                                strings.products.products.toLowerCase()}
                        </p>

                    </div>

                </div>

                <div className="flex gap-2">

                    {loading ? (
                        <div className="h-5 w-5 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin"/>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.();
                            }}
                            className="
                            text-zinc-500
                            hover:text-zinc-800
                        "
                        >
                            <Pencil size="18"/>
                        </button>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.();
                        }}
                        className="text-zinc-500 hover:text-red-500 transition"
                    >
                        <Trash2 size="18"/>
                    </button>

                </div>

            </div>

        </div>
    );
}