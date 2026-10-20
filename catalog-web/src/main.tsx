import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import AppRouter from "./router/AppRouter.tsx";
import {LanguageProvider} from "./utils/LanguageContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LanguageProvider>
            <AppRouter />
        </LanguageProvider>
    </StrictMode>
);
