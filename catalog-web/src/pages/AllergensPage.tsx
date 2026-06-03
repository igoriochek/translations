import {useEffect, useState} from "react";
import AdminLayout from "../layouts/AdminLayout";
import type {Allergen} from "../api/types.ts";
import {deleteAllergen, getAllergens} from "../api/allergens.ts";
import AllergenCard from "../components/card/AllergenCard.tsx";
import AllergenSkeleton from "../components/skeleton/AllergenSkeleton.tsx";
import AddAllergenModal from "../components/modal/AddAllergenModal.tsx";
import EditAllergenModal from "../components/modal/EditAllergenModal.tsx";
import ConfirmModal from "../components/modal/ConfirmModal.tsx";

export default function AllergensPage() {
	const [allergens, setAllergens] = useState<Allergen[]>([]);
	const [selectedAllergen, setSelectedAllergen] = useState<Allergen | null>(null);

	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadAllergens() {
			setLoading(true);

			try {
				const data = await getAllergens();

				setAllergens(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		loadAllergens();
	}, []);

	async function handleDeleteAllergen(id: number) {

		try {
			await deleteAllergen(id);
			setAllergens((prev) => prev.filter((x) => x.id !== id));
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
							Allergens
						</h1>

						<p className="text-zinc-600">
							Manage localized
							product allergens.
						</p>
					</div>

					<button
						onClick={() => setShowAddModal(true)}
						className="bg-black text-white px-4 py-2 rounded-lg text-sm"
					>
						Add Allergen
					</button>

				</div>

				<div className="space-y-3">
					{loading ? (
						Array.from({length: 4}).map(
							(_, index) => (<AllergenSkeleton key={index}/>)
						)
					) : (
						allergens.map((allergen) => (
							<AllergenCard
								key={allergen.id}
								allergen={allergen}
								onEdit={() => {
									setSelectedAllergen(allergen);
									setShowEditModal(true);
								}}
								onDelete={() => {
									setSelectedAllergen(allergen);
									setShowDeleteModal(true);
								}}
							/>
						))
					)}
				</div>

			</div>

			<AddAllergenModal
				open={showAddModal}
				onClose={() => setShowAddModal(false)}
				onCreated={(allergen) => {
					setAllergens((prev) => [
						...prev,
						allergen
					]);
				}}
			/>

			<EditAllergenModal
				open={showEditModal}
				allergen={selectedAllergen}
				onClose={() => {
					setShowEditModal(false);
					setSelectedAllergen(null);
				}}
				onUpdated={(updated) => {
					setAllergens((prev) =>
						prev.map((x) => {
							if (x.id !== updated.id)
								return x;

							return updated;
						})
					);
				}}
			/>

			<ConfirmModal
				open={showDeleteModal}
				title="Delete Allergen"
				message={`Are you sure you want to delete this allergen?`}
				confirmText="Delete"
				onClose={() => {
					setShowDeleteModal(false);
					setSelectedAllergen(null);
				}}
				onConfirm={() => {
					if (!selectedAllergen)
						return;

					handleDeleteAllergen(selectedAllergen.id).then(() => {
						setShowDeleteModal(false);
						setSelectedAllergen(null);
					});
				}}
			/>
		</AdminLayout>
	);
}