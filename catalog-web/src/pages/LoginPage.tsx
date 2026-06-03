import { useState } from 'react';
import { login } from '../api/auth';

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e: React.FormEvent) {

        e.preventDefault();

        try {

            const data = await login(email, password);

            localStorage.setItem('token', data.token);

            window.location.href = '/';

        } catch (err) {

            console.error(err);
            alert('Login failed');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100">

            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
            >

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Admin Login
                </h1>

                <div className="mb-4">

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div className="mb-6">

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90"
                >
                    Login
                </button>

            </form>
        </div>
    );
}