import {type ReactNode, useEffect, useState} from 'react';
import Header from '../components/Header';
import { getCurrentUser } from '../api/auth';
import type {User} from "../api/types.ts";
import {useNavigate} from "react-router-dom";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({
                                        children
                                    }: AdminLayoutProps) {

    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {

        async function loadUser() {

            try {

                const data = await getCurrentUser();

                setUser(data);

            } catch (err) {
                console.error(err);
                navigate("/login");
            }
        }

        loadUser();

    }, []);

    return (
        <div className="min-h-screen bg-zinc-100">

            <Header user={user} />

            <main className="p-6">
                {children}
            </main>

        </div>
    );
}