import { useState } from 'react';

import Modal from './Modal';
import type {SellerListItem} from "../../api/types.ts";
import { createSeller } from '../../api/sellers.ts'

interface AddSellerModalProps {
    open: boolean;

    onClose: () => void;
    onCreated: (seller: SellerListItem) => void;
}

export default function AddSellerModal({
                                           open,
                                           onClose,
                                           onCreated
                                       }: AddSellerModalProps) {

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {

        if (!name.trim()) {
            return;
        }

        try {

            setLoading(true);

            const seller = await createSeller(name);

            onCreated(seller);

            setName('');

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
            title="Add Seller"
            onClose={onClose}
        >

            <div className="space-y-4">

                <div>

                    <label className="block mb-1 text-sm font-medium">
                        Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="
                            px-4 py-2
                            rounded-lg
                            border
                            border-zinc-300
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="
                            px-4 py-2
                            rounded-lg
                            bg-zinc-900
                            text-white
                        "
                    >
                        {loading
                            ? 'Creating...'
                            : 'Create'}
                    </button>

                </div>

            </div>

        </Modal>
    );
}