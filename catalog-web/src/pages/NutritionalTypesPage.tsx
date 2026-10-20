import {useEffect, useState} from "react";
import AdminLayout from "../layouts/AdminLayout";
import type {NutritionalType} from "../api/types.ts";
import {deleteNutritionalType, getNutritionalTypes} from "../api/nutritionalTypes.ts";
import NutritionalTypeCard from "../components/card/NutritionalTypeCard.tsx";
import NutritionalTypeSkeleton from "../components/skeleton/NutritionalTypeSkeleton.tsx";
import AddNutritionalTypeModal from "../components/modal/AddNutritionalTypeModal.tsx";
import EditNutritionalTypeModal from "../components/modal/EditNutritionalTypeModal.tsx";
import ConfirmModal from "../components/modal/ConfirmModal.tsx";
import {strings} from "../utils/localization.ts";
import {useLanguage} from "../utils/LanguageContext.tsx";

export default function NutritionalTypesPage() {

	const [nutritionalTypes, setNutritionalTypes] = useState<NutritionalType[]>([]);
	const [selectedNutritionalType, setSelectedNutritionalType] = useState<NutritionalType | null>(null);

	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [loading, setLoading] = useState(true);

	useLanguage();

	useEffect(() => {
		async function loadNutritionalTypes() {
			setLoading(true);

			try {
				const data =
					await getNutritionalTypes();

				setNutritionalTypes(data);

			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		loadNutritionalTypes();

	}, []);

	async function handleDeleteNutritionalType(
		id: number
	) {

		try {
			await deleteNutritionalType(id);

			setNutritionalTypes((prev) => prev.filter((x) => x.id !== id));

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
							{strings.nutritional_types_title}
						</h1>

						<p className="text-zinc-600">
							{strings.nutritional_types.hint}
						</p>

					</div>

					<button
						onClick={() =>
							setShowAddModal(true)
						}
						className="
                            bg-black
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                        "
					>
						{strings.nutritional_types.add_label}
					</button>

				</div>

				<div className="space-y-3">

					{loading ? (

						Array.from({length: 4}).map(
							(_, index) => (
								<NutritionalTypeSkeleton
									key={index}
								/>
							)
						)

					) : (

						nutritionalTypes.map((nutritionalType) => (

							<NutritionalTypeCard
								key={nutritionalType.id}
								nutritionalType={nutritionalType}
								onEdit={() => {
									setSelectedNutritionalType(
										nutritionalType
									);
									setShowEditModal(
										true
									);
								}}
								onDelete={() => {
									setSelectedNutritionalType(
										nutritionalType
									);
									setShowDeleteModal(
										true
									);
								}}
							/>

						))

					)}

				</div>

			</div>

			<AddNutritionalTypeModal
				open={showAddModal}
				onClose={() =>
					setShowAddModal(false)
				}
				onCreated={(nutritionalType) => {
					setNutritionalTypes((prev) => [
						nutritionalType,
						...prev
					]);
				}}
			/>

			<EditNutritionalTypeModal
				open={showEditModal}
				nutritionalType={selectedNutritionalType}
				onClose={() => {
					setShowEditModal(false);
					setSelectedNutritionalType(null);
				}}
				onUpdated={(updated) => {

					setNutritionalTypes((prev) =>
						prev.map((x) => {
							if (x.id !== updated.id) {
								return x;
							}

							return updated;
						})
					);
				}}
			/>

			<ConfirmModal
				open={showDeleteModal}
				title={strings.nutritional_types.delete_title}
				message={strings.nutritional_types.delete_confirm}
				confirmText={strings.delete_button}
				onClose={() => {
					setShowDeleteModal(false);
					setSelectedNutritionalType(null);
				}}
				onConfirm={() => {
					if (!selectedNutritionalType) {
						return;
					}

					handleDeleteNutritionalType(
						selectedNutritionalType.id
					).then(() => {
						setShowDeleteModal(false);
						setSelectedNutritionalType(null);
					});
				}}
			/>

		</AdminLayout>
	);
}