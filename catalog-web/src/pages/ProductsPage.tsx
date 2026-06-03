import AdminLayout from "../layouts/AdminLayout";
import ProductSkeleton from "../components/skeleton/ProductSkeleton.tsx";
import {useEffect, useState} from "react";
import type {Category, Manufacturer, ProductListItem} from "../api/types.ts";
import ProductCard from "../components/card/ProductCard.tsx";
import {getProducts} from "../api/products.ts";
import AddProductModal from "../components/modal/AddProductModal.tsx";
import {getManufacturers} from "../api/manufacturers.ts";
import {getCategories} from "../api/categories.ts";
import ProductFilters from "../components/ProductFilters.tsx";

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductListItem[]>([]);
    const [showAddProductModal, setShowAddProductModal] = useState(false);

    const [search, setSearch] = useState('');
    const [manufacturerIds, setManufacturerIds] = useState<number[]>([]);
    const [categoryIds, setCategoryIds] = useState<number[]>([]);

    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        async function loadFilters() {
            try {
                const [
                    manufacturersData,
                    categoriesData
                ] = await Promise.all([
                    getManufacturers(),
                    getCategories()
                ]);
                setManufacturers(manufacturersData);
                setCategories(categoriesData);
                setManufacturerIds(manufacturersData.map((m) => m.id));
                setCategoryIds(categoriesData.map((c) => c.id));
            } catch (err) {
                console.error(err);
            }
        }

        loadFilters();
        loadProducts();
    }, []);

    useEffect(() => {
        loadProducts(1);
    }, [search, manufacturerIds, categoryIds]);

    async function loadProducts(nextPage = 1) {
        try {
            if (nextPage === 1)
                setLoading(true);
            else
                setLoadingMore(true);

            const response = await getProducts(nextPage, 20, {
                name: search || undefined,
                manufacturer_ids: manufacturerIds,
                category_ids: categoryIds
            });

            if (nextPage === 1)
                setProducts(response.data)
            else
                setProducts((prev) => [
                    ...prev,
                    ...response.data
                ]);

            setPage(response.current_page);
            setHasMore(response.current_page < response.last_page);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Products
                        </h1>

                        <p className="text-zinc-600">
                            Manage product entries.
                        </p>
                    </div>

                    <button
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                        onClick={() => setShowAddProductModal(true)}
                    >
                        Add Product
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 border border-zinc-200 rounded-xl px-4 py-3 bg-white shadow-sm"
                    />

                    <ProductFilters
                        manufacturers={manufacturers}
                        categories={categories}
                        selectedManufacturerIds={manufacturerIds}
                        selectedCategoryIds={categoryIds}
                        onManufacturerChange={setManufacturerIds}
                        onCategoryChange={setCategoryIds}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({length: 8}).map((_, index) => (
                            <ProductSkeleton key={index}/>
                        ))
                    ) : (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product}/>
                        ))
                    )}
                </div>

                {hasMore && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => loadProducts(page + 1)}
                            disabled={loadingMore}
                            className="px-5 py-3 rounded-xl bg-white border border-zinc-200 shadow-sm text-sm"
                        >
                            {loadingMore ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                )}
            </div>

            <AddProductModal
                open={showAddProductModal}
                onClose={() => setShowAddProductModal(false)}
                onCreated={() => {loadProducts()}}
            />
        </AdminLayout>
    );
}