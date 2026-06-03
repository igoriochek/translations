import {useEffect, useState} from "react";

import AdminLayout from "../layouts/AdminLayout";

import type {User} from "../api/types.ts";

import {getAdmins, deleteAdmin} from "../api/users.ts";

import AdminSkeleton from "../components/skeleton/AdminSkeleton.tsx";
import AdminCard from "../components/card/AdminCard.tsx";

import AddAdminModal from "../components/modal/AddAdminModal.tsx";
import ConfirmModal from "../components/modal/ConfirmModal.tsx";

export default function UsersPage() {

    const [admins, setAdmins] =
        useState<User[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [selectedAdmin, setSelectedAdmin] =
        useState<User | null>(null);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    useEffect(() => {

        async function loadAdmins() {

            setLoading(true);

            try {

                const data = await getAdmins();

                setAdmins(data);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);
            }
        }

        loadAdmins();

    }, []);

    async function handleDeleteAdmin(id: number) {

        try {

            await deleteAdmin(id);

            setAdmins((prev) =>
                prev.filter((x) => x.id !== id)
            );

            setSelectedAdmin(null);

        } catch (err) {

            console.error(err);
        }
    }

    return (
        <AdminLayout>

            <div className="space-y-6">

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-bold">
                            Administrators
                        </h1>

                        <p className="text-zinc-600">
                            Manage administrator accounts.
                        </p>

                    </div>

                    <button
                        className="
                            bg-black
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                        "
                        onClick={() =>
                            setShowAddModal(true)
                        }
                    >
                        Add Administrator
                    </button>

                </div>

                <div className="space-y-3">

                    {loading ? (

                        Array.from({length: 4}).map((_, index) => (
                            <AdminSkeleton key={index}/>
                        ))

                    ) : admins.length === 0 ? (

                        <div
                            className="
                                bg-white
                                rounded-xl
                                border border-zinc-100
                                shadow-sm
                                py-10
                                text-center
                            "
                        >

                            <p className="text-zinc-400">

                                No additional administrators
                                have been added yet.

                            </p>

                        </div>

                    ) : (

                        admins.map((admin) => (

                            <AdminCard
                                key={admin.id}
                                admin={admin}
                                onDelete={() => {

                                    setSelectedAdmin(admin);

                                    setShowDeleteModal(true);
                                }}
                            />

                        ))
                    )}

                </div>

            </div>

            <AddAdminModal
                open={showAddModal}
                onClose={() =>
                    setShowAddModal(false)
                }
                onCreated={(admin) => {

                    setAdmins((prev) => [
                        ...prev,
                        admin
                    ]);
                }}
            />

            <ConfirmModal
                open={showDeleteModal}
                title="Delete Administrator"
                message={
                    `Are you sure you want to delete "${selectedAdmin?.name}"?`
                }
                confirmText="Delete"
                onClose={() => {

                    setShowDeleteModal(false);

                    setSelectedAdmin(null);
                }}
                onConfirm={() => {

                    if (!selectedAdmin) {
                        return;
                    }

                    handleDeleteAdmin(
                        selectedAdmin.id
                    ).then(() => {

                        setShowDeleteModal(false);
                    });
                }}
            />

        </AdminLayout>
    );
}