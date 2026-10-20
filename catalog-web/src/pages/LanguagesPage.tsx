import {useEffect, useState} from "react";
import AdminLayout from "../layouts/AdminLayout";
import type {Language} from "../api/types.ts";
import {deleteLanguage, getLanguages} from "../api/languages.ts";
import LanguageCard from "../components/card/LanguageCard.tsx";
import LanguageSkeleton from "../components/skeleton/LanguageSkeleton.tsx";
import AddLanguageModal from "../components/modal/AddLanguageModal.tsx";
import ConfirmModal from "../components/modal/ConfirmModal.tsx";
import EditLanguageModal from "../components/modal/EditLanguageModal.tsx";
import {strings} from "../utils/localization.ts";
import {useLanguage} from "../utils/LanguageContext.tsx";

export default function LanguagesPage() {
	const [languages, setLanguages] = useState<Language[]>([]);
	const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [loading, setLoading] = useState(true);

	useLanguage();

	useEffect(() => {
		async function loadLanguages() {
			setLoading(true);

			try {
				const data = await getLanguages();
				setLanguages(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		loadLanguages();
	}, []);

	async function handleDeleteLanguage(id: number) {
		try {
			await deleteLanguage(id);
			setLanguages((prev) => prev.filter((x) => x.id !== id));
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
							{strings.languages_title}
						</h1>

						<p className="text-zinc-600">
							{strings.languages.hint}
						</p>

					</div>

					<button
						onClick={() => setShowAddModal(true)}
						className="
                            bg-black
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                        "
					>
						{strings.languages.add_label}
					</button>

				</div>

				<div className="space-y-3">

					{loading ? (
						Array.from({length: 4}).map((_, index) => (
							<LanguageSkeleton key={index}/>
						))
					) : (
						languages.map((language) => (
							<LanguageCard
								key={language.id}
								language={language}
								onEdit={() => {
									setSelectedLanguage(language);
									setShowEditModal(true);
								}}
								onDelete={() => {
									setSelectedLanguage(language);
									setShowDeleteModal(true);
								}}
							/>

						))

					)}

				</div>

			</div>

			<AddLanguageModal
				open={showAddModal}
				onClose={() => setShowAddModal(false)}
				onCreated={(language) => {
					setLanguages((prev) => [
						...prev,
						language
					]);
				}}
			/>

			<EditLanguageModal
				open={showEditModal}
				language={selectedLanguage}
				onClose={() =>
					setShowEditModal(false)
				}
				onUpdated={(lang) => {
					setLanguages((prev) => prev.map((l) => {
						if (l.id === lang.id)
							return lang;

						return l;
					}))
				}}
			/>

			<ConfirmModal
				open={showDeleteModal}
				title={strings.languages.delete_title}
				message={
					`${strings.formatString(strings.languages.delete_confirm, selectedLanguage?.name ?? '')}`
				}
				confirmText={strings.delete_button}
				onClose={() => {
					setShowDeleteModal(false);
					setSelectedLanguage(null);
				}}
				onConfirm={() => {
					if (!selectedLanguage) {
						return;
					}

					handleDeleteLanguage(selectedLanguage.id).then(() => {
						setShowDeleteModal(false);
					});
				}}
			/>

		</AdminLayout>
	);
}