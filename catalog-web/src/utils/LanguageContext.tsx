import {createContext, useContext, useState} from 'react';
import {
	strings,
	supportedLanguages,
	getSavedLanguage
} from './localization.ts';

interface LanguageContextType {
	language: string;
	changeLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({children}: {children: React.ReactNode}) {

	const [language, setLanguageState] = useState(() => {
		const saved = getSavedLanguage();

		strings.setLanguage(saved);

		return saved;
	});

	function changeLanguage(language: string) {

		if (!supportedLanguages.some(item => item.code === language)) {
			return;
		}

		strings.setLanguage(language);
		localStorage.setItem('catalog_language', language);

		setLanguageState(language);
	}

	return (
		<LanguageContext.Provider value={{language, changeLanguage}}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {

	const context = useContext(LanguageContext);

	if (!context) {
		throw new Error('useLanguage must be used inside LanguageProvider');
	}

	return context;
}