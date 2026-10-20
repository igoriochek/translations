import AdminLayout from '../layouts/AdminLayout';
import {useEffect, useState} from "react";
import type {Manufacturer} from "../api/types.ts";
import {deleteManufacturer, getManufacturers} from "../api/manufacturers.ts";
import {
    Pencil,
    Trash2
} from 'lucide-react';
import ManufacturerSkeleton from "../components/skeleton/ManufacturerSkeleton.tsx";
import AddManufacturerModal from "../components/modal/AddManufacturerModal.tsx";
import ConfirmModal from "../components/modal/ConfirmModal.tsx";
import EditManufacturerModal from "../components/modal/EditManufacturerModal.tsx";
import {strings} from "../utils/localization.ts";
import {useLanguage} from "../utils/LanguageContext.tsx";

export default function ManufacturersPage() {
    const [manufacturers, setManufacturers] = useState([] as Manufacturer[]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);

    useLanguage();

    useEffect(() => {

        async function loadManufacturers() {
            setLoading(true);
            try {

                const data = await getManufacturers();

                setManufacturers(data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadManufacturers();

    }, []);

    async function handleCreateManufacturer(manufacturer: Manufacturer) {
        try {
            setManufacturers((prev) => [
                ...prev,
                manufacturer
            ]);

            setShowCreateModal(false);

        } catch (err) {
            console.error(err);
        }
    }

    async function handleEditManufacturer(manufacturer: Manufacturer) {
        try {
            setManufacturers((prev) => prev.map((m: Manufacturer) => {
                if(m.id === manufacturer.id)
                    return manufacturer;

                return m;
            }));

            setShowEditModal(false);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDeleteManufacturer(id: number) {
        try {
            if (!deleteManufacturer(id))
                throw new Error("Could not delete Manufacturer");

            setManufacturers((prev) => [
                ...prev.filter((manufacturer) => manufacturer.id !== id),
            ])

            setShowDeleteModal(false);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <AdminLayout>

            <div className="flex items-center justify-between mb-2">

                <div>
                    <h1 className="text-2xl font-bold">
                        {strings.manufacturers_title}
                    </h1>

                    <p className="text-zinc-600">
                        {strings.manufacturers.hint}
                    </p>
                </div>

                <button
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                    onClick={() => setShowCreateModal(true)}
                >
                    {strings.manufacturers.add_label}
                </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                {loading ? (
                    Array.from({length: 4}).map((_, index) => (
                        <ManufacturerSkeleton key={index}/>
                    ))
                ) : (
                    manufacturers.map((manufacturer) => (
                        <div
                            key={manufacturer.id}
                            className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5"
                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <h2 className="font-semibold text-lg">
                                        {manufacturer.name}
                                    </h2>

                                    <p className="text-sm text-zinc-500 mt-1">
                                        {manufacturer.country || strings.manufacturers.no_country}
                                    </p>

                                </div>

                                <div className="flex gap-2">

                                    <button
                                        className="text-zinc-500 hover:text-black transition"
                                        onClick={() => {
                                            setSelectedManufacturer(manufacturer);
                                            setShowEditModal(true);
                                        }}
                                    >
                                        <Pencil size={18}/>
                                    </button>

                                    <button
                                        className="text-zinc-500 hover:text-red-500 transition"
                                        onClick={() => {
                                            setSelectedManufacturer(manufacturer);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        <Trash2 size={18}/>
                                    </button>

                                </div>

                            </div>

                        </div>
                    ))
                )}
            </div>

            <AddManufacturerModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={(manufacturer) => {
                    handleCreateManufacturer(manufacturer);
                }}
            />

            <EditManufacturerModal
                open={showEditModal}
                manufacturer={selectedManufacturer ?? {id: 0, name: "", country: undefined}}
                onValueChange={(value) => {setSelectedManufacturer(value)}}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedManufacturer(null);
                }}
                onSubmit={(manufacturer) => {
                    handleEditManufacturer(manufacturer);
                }}
            />

            <ConfirmModal
                open={showDeleteModal}
                title={strings.manufacturers.delete_title}
                message={
                    `${strings.formatString(strings.manufacturers.delete_confirm, selectedManufacturer?.name ?? "")}`
                }
                confirmText={strings.delete_button}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedManufacturer(null);
                }}
                onConfirm={() => {
                    if(selectedManufacturer)
                        handleDeleteManufacturer(selectedManufacturer.id);
                }}
            />
        </AdminLayout>
    );
}