import AdminLayout from '../layouts/AdminLayout';
import {useEffect, useState} from "react";
import {getDashboardStats} from "../api/dashboard.ts";
import {useNavigate} from "react-router-dom";
import {ExternalLinkIcon} from "lucide-react";
import {strings} from "../utils/localization.ts";
import {useLanguage} from "../utils/LanguageContext.tsx";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        products: 0,
        recipes: 0,
        sellers: 0,
        manufacturers: 0,
        users: 0
    });
    const [loading, setLoading] = useState(false);
    useLanguage();
    const navigate = useNavigate();

    useEffect(() => {

        async function loadStats() {
            setLoading(true);
            try {

                const data = await getDashboardStats();

                setStats(data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadStats();

    }, []);

    function DashboardButton(label: string, value: number, redirect: string) {
        return (
            <div
                onClick={() => navigate(redirect)}
                className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200 cursor-pointer hover:shadow-md transition"
            >
                <div className="flex items-start justify-between">

                    <div>
                        <p className="text-sm text-zinc-500 mb-2">
                            {label}
                        </p>

                        {loading ? (
                            <div className="h-8 w-16 bg-zinc-200 rounded animate-pulse"></div>
                        ) : (
                            <h2 className="text-3xl font-bold">
                                {value}
                            </h2>
                        )}
                    </div>

                    <ExternalLinkIcon size={26}/>

                </div>
            </div>);
    }

    return (
        <AdminLayout>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">

                {DashboardButton(strings.products_title, stats.products, '/products')}

                {DashboardButton(strings.recipes_title, stats.recipes, '/recipes')}

                {DashboardButton(strings.sellers_title, stats.sellers, '/sellers')}

                {DashboardButton(strings.manufacturers_title, stats.manufacturers, '/manufacturers')}

                {DashboardButton(strings.admins_title, stats.users, '/admins')}
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-sm border border-zinc-200 p-6">

                <h2 className="text-xl font-semibold mb-4">
                    {strings.dashboard.welcome}
                </h2>

                <p className="text-zinc-600 leading-relaxed">
                    {strings.dashboard.hint}
                </p>

            </div>

        </AdminLayout>
    );
}