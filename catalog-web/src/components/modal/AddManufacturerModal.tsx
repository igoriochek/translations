import { useState } from 'react';

import Modal from './Modal';

import { createManufacturer } from '../../api/manufacturers';

import type { Manufacturer } from '../../api/types';

interface AddManufacturerModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (manufacturer: Manufacturer) => void;
}

export default function AddManufacturerModal({
                                                 open,
                                                 onClose,
                                                 onCreated
                                             }: AddManufacturerModalProps) {

    const [name, setName] = useState('');
    const [country, setCountry] = useState('');

    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        setLoading(true);

        try {

            const manufacturer = await createManufacturer(
                name,
                country || undefined
            );

            onCreated(manufacturer);

            setName('');
            setCountry('');

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
            title="Add Manufacturer"
            onClose={onClose}
        >

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

                <div>

                    <label className="block text-sm font-medium mb-1">
                        Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="
                            w-full
                            border border-zinc-300
                            rounded-lg
                            px-3 py-2
                            outline-none
                            focus:ring-2
                            focus:ring-black
                        "
                        placeholder="Manufacturer name"
                    />

                </div>

                <div>

                    <label className="block text-sm font-medium mb-1">
                        Country
                    </label>

                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="
                            w-full
                            border border-zinc-300
                            rounded-lg
                            px-3 py-2
                            outline-none
                            focus:ring-2
                            focus:ring-black
                        "
                        placeholder="Optional"
                    />

                </div>

                <div className="flex justify-end gap-3 pt-2">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            px-4 py-2
                            rounded-lg
                            border border-zinc-300
                            hover:bg-zinc-100
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            bg-black
                            text-white
                            px-4 py-2
                            rounded-lg
                            hover:opacity-90
                            disabled:opacity-50
                        "
                    >
                        {loading ? 'Adding...' : 'Add'}
                    </button>

                </div>

            </form>

        </Modal>
    );
}