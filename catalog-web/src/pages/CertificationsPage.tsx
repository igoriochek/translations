import {useEffect, useState} from "react";
import AdminLayout from "../layouts/AdminLayout";
import type {Certification} from "../api/types.ts";
import IngredientSkeleton from "../components/skeleton/IngredientSkeleton.tsx";
import ConfirmModal from "../components/modal/ConfirmModal.tsx";
import {strings} from "../utils/localization.ts";
import {useLanguage} from "../utils/LanguageContext.tsx";
import {deleteCertification, getCertifications} from "../api/certifications.ts";
import CertificationCard from "../components/card/CertificationCard.tsx";
import AddCertificationModal from "../components/modal/AddCertificationModal.tsx";
import EditCertificationModal from "../components/modal/EditCertificationModal.tsx";

export default function CertificationsPage() {
	const [certifications, setCertifications] = useState<Certification[]>([]);
	const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);

	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [loading, setLoading] = useState(true);

	useLanguage();

	useEffect(() => {
		async function loadCertifications() {
			setLoading(true);

			try {
				const data = await getCertifications();
				setCertifications(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		loadCertifications();

	}, []);

	async function handleDeleteCertification(id: number) {

		try {
			await deleteCertification(id);

			setCertifications((prev) => prev.filter((x) => x.id !== id));

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
							{strings.certifications_title}
						</h1>

						<p className="text-zinc-600">
							{strings.certifications.hint}
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
						{strings.certifications.add_label}
					</button>

				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">

					{loading ? (

						Array.from({length: 4}).map(
							(_, index) => (
								<IngredientSkeleton
									key={index}
								/>
							)
						)

					) : (

						certifications.map((certification) => (

							<CertificationCard
								key={certification.id}
								certification={certification}
								onEdit={() => {
									setSelectedCertification(
										certification
									);
									setShowEditModal(
										true
									);
								}}
								onDelete={() => {
									setSelectedCertification(
										certification
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

			<AddCertificationModal
				open={showAddModal}
				onClose={() =>
					setShowAddModal(false)
				}
				onCreated={(certification) => {

					setCertifications((prev) => [

						certification,

						...prev

					]);
				}}
			/>

			<EditCertificationModal
				open={showEditModal}
				certification={selectedCertification}
				onClose={() => {
					setShowEditModal(false);
					setSelectedCertification(null);
				}}
				onUpdated={(updated) => {

					setCertifications((prev) =>
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
				title={strings.ingredients.delete_title}
				message={strings.ingredients.delete_confirm}
				confirmText={strings.delete_button}
				onClose={() => {
					setShowDeleteModal(false);
					setSelectedCertification(null);
				}}
				onConfirm={() => {
					if (!selectedCertification) {
						return;
					}

					handleDeleteCertification(
						selectedCertification.id
					).then(() => {
						setShowDeleteModal(false);
						setSelectedCertification(null);
					});
				}}
			/>

		</AdminLayout>
	);
}