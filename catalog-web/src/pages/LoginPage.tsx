import {useState} from 'react';
import {login} from '../api/auth';
import {strings, supportedLanguages} from "../utils/localization.ts";
import {useLanguage} from "../utils/LanguageContext.tsx";

export default function LoginPage() {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const {language, changeLanguage} = useLanguage();

	async function handleLogin(e: React.FormEvent) {

		e.preventDefault();

		try {

			const data = await login(email, password);

			localStorage.setItem('token', data.token);

			window.location.href = '/';

		} catch (err) {

			console.error(err);
			alert(strings.login.error);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-zinc-100">

			<select
				value={language}
				onChange={(e) => changeLanguage(e.target.value)}
				className="absolute top-6 right-6 border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white"
			>
				{supportedLanguages.map((language) => (
					<option key={language.code} value={language.code}>
						{language.flag} {language.name}
					</option>
				))}
			</select>

			<form
				onSubmit={handleLogin}
				className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
			>

				<h1 className="text-2xl font-bold mb-6 text-center">
					{strings.login_title}
				</h1>

				<div className="mb-4">

					<input
						type="email"
						placeholder={strings.login.email_input}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full border rounded-lg px-4 py-2"
					/>
				</div>

				<div className="mb-6">

					<input
						type="password"
						placeholder={strings.login.password_input}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full border rounded-lg px-4 py-2"
					/>
				</div>

				<button
					type="submit"
					className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90"
				>
					{strings.login.login_button}
				</button>

			</form>
		</div>
	);
}