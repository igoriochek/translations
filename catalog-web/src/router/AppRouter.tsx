import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import SellersPage from '../pages/SellersPage';
import ManufacturersPage from '../pages/ManufacturersPage';
import AdminsPage from '../pages/AdminsPage.tsx';
import LanguagesPage from "../pages/LanguagesPage.tsx";
import CategoriesPage from "../pages/CategoriesPage.tsx";
import AllergensPage from "../pages/AllergensPage.tsx";
import NutritionalTypesPage from "../pages/NutritionalTypesPage.tsx";
import IngredientsPage from "../pages/IngredientsPage.tsx";
import RecipesPage from "../pages/RecipesPage.tsx";
import ProductPage from "../pages/ProductPage.tsx";

function ProtectedRoute({ children }: any) {

    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default function AppRouter() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <ProductsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/products/:id"
                    element={<ProductPage/>}
                />

                <Route
                    path="/recipes"
                    element={
                        <ProtectedRoute>
                            <RecipesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/sellers"
                    element={
                        <ProtectedRoute>
                            <SellersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manufacturers"
                    element={
                        <ProtectedRoute>
                            <ManufacturersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute>
                            <CategoriesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/allergens"
                    element={
                        <ProtectedRoute>
                            <AllergensPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/nutritional-types"
                    element={
                        <ProtectedRoute>
                            <NutritionalTypesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/languages"
                    element={
                        <ProtectedRoute>
                            <LanguagesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ingredients"
                    element={
                        <ProtectedRoute>
                            <IngredientsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admins"
                    element={
                        <ProtectedRoute>
                            <AdminsPage />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}