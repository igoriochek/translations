import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import type {User} from "../api/types.ts";
import MetadataDropdown from "./MetadataDropdown.tsx";

interface HeaderProps {
    user: User | null;
}

export default function Header({ user }: HeaderProps) {

    const navigate = useNavigate();

    async function handleLogout() {

    try {
        await logout();
    } catch (err) {
        console.error(err);
    }

    localStorage.removeItem('token');

    navigate('/login');
}

function navClass({ isActive }: { isActive: boolean }) {
    return isActive
        ? 'font-semibold text-black'
        : 'text-zinc-600 hover:text-black';
}

return (
    <header className="h-16 bg-white shadow-sm border-b border-zinc-200 px-6 flex items-center justify-between">

        <div className="flex items-center gap-10">

            <h1 className="text-xl font-bold">
                Catalog Admin
            </h1>

            <nav className="flex items-center gap-5 text-sm">

                <NavLink to="/" className={navClass}>
                    Dashboard
                </NavLink>

                <NavLink to="/products" className={navClass}>
                    Products
                </NavLink>

                <NavLink to="/recipes" className={navClass}>
                    Recipes
                </NavLink>

                <NavLink to="/sellers" className={navClass}>
                    Sellers
                </NavLink>

                <NavLink to="/manufacturers" className={navClass}>
                    Manufacturers
                </NavLink>

                <MetadataDropdown />

                <NavLink to="/admins" className={navClass}>
                    Admins
                </NavLink>

            </nav>
        </div>

        <div className="flex items-center gap-4">

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
                Logout
            </button>

        </div>

    </header>
);
}