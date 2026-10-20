import {NavLink, useNavigate} from 'react-router-dom';
import {logout} from '../api/auth';
import type {User} from "../api/types.ts";
import MetadataDropdown from "./MetadataDropdown.tsx";
import {strings, supportedLanguages} from "../utils/localization.ts";
import {useLanguage} from "../utils/LanguageContext.tsx";

interface HeaderProps {
	user: User | null;
}

export default function Header({user}: HeaderProps) {

	const navigate = useNavigate();
	const {language, changeLanguage} = useLanguage();

	async function handleLogout() {

		try {
			await logout();
		} catch (err) {
			console.error(err);
		}

		localStorage.removeItem('token');

		navigate('/login');
	}

	function navClass({isActive}: { isActive: boolean }) {
		return isActive
			? 'font-semibold text-black'
			: 'text-zinc-600 hover:text-black';
	}

	return (
		<header className="h-16 bg-white shadow-sm border-b border-zinc-200 px-6 flex items-center justify-between">

			<div className="flex items-center gap-10">

				<h1 className="text-xl font-bold">
					{strings.app_name}
				</h1>

				<nav className="flex items-center gap-5 text-sm">

					<NavLink to="/" className={navClass}>
						{strings.dashboard_title}
					</NavLink>

					<NavLink to="/products" className={navClass}>
						{strings.products_title}
					</NavLink>

					<NavLink to="/recipes" className={navClass}>
						{strings.recipes_title}
					</NavLink>

					<NavLink to="/sellers" className={navClass}>
						{strings.sellers_title}
					</NavLink>

					<NavLink to="/manufacturers" className={navClass}>
						{strings.manufacturers_title}
					</NavLink>

					<MetadataDropdown/>

					<NavLink to="/admins" className={navClass}>
						{strings.admins_title}
					</NavLink>

				</nav>
			</div>

			<div className="flex items-center gap-4">

				<select
					value={language}
					onChange={(e) => changeLanguage(e.target.value)}
					className="border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white"
				>
					{supportedLanguages.map((language) => (
						<option key={language.code} value={language.code}>
							{language.flag} {language.name}
						</option>
					))}
				</select>

				<div className="text-right">
					<p className="text-sm font-medium">
						{user?.name}
					</p>

					<p className="text-xs text-zinc-500">
						{user?.email}
					</p>
				</div>

				<button
					onClick={handleLogout}
					className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:opacity-90"
				>
					{strings.login.logout_button}
				</button>

			</div>

		</header>
	);
}