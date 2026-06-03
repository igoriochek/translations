import {useState} from 'react';
import Modal from './Modal';
import type {Manufacturer} from '../../api/types';
import {updateManufacturer} from "../../api/manufacturers.ts";

interface EditManufacturerModalProps {
    open: boolean;
    manufacturer: Manufacturer;
    onValueChange: (manufacturer: Manufacturer) => void;
    onClose: () => void;
    onSubmit: (manufacturer: Manufacturer) => void;
}

export default function EditManufacturerModal({
                                                  open,
                                                  manufacturer,
                                                  onValueChange,
                                                  onClose,
                                                  onSubmit
                                              }: EditManufacturerModalProps) {

    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        if (!manufacturer.name.trim()) {
            return;
        }

        setLoading(true);

        try {
            const m = await updateManufacturer(manufacturer);

            onSubmit(m);

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
            title="Edit Manufacturer"
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
                        value={manufacturer.name}
                        onChange={(e) => onValueChange({...manufacturer, name: e.target.value})}
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
                        value={manufacturer.country ?? ""}
                        onChange={(e) => onValueChange({...manufacturer, country: e.target.value})}
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
                        {loading ? 'Saving...' : 'Save'}
                    </button>

                </div>

            </form>

        </Modal>
    );
}