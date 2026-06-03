export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Image {
    id: number;
    image_url: string;
}

export interface Manufacturer {
    id: number;
    name: string;
    country?: string;
}

export interface Recipe {
    id: number;
    names: RecipeName[];
    contents: RecipeContent[];
    ingredients: ProductListItem[];
}

export interface RecipeName {
    id: number;
    name: string;
    language: Language;
}

export interface RecipeContent {
    id: number;
    content: string;
    language: Language;
}

export interface Product {
    id: number;
    manufacturer: Manufacturer;
    names: ProductName[];
    categories: Category[];
    ingredients: ProductIngredient[];
    nutritional_measurements: NutritionalMeasurement[];
    related_products: Product[];
    allergens: Allergen[];
    images: Image[];
}

export interface ProductIngredient {
    id: number;
    ingredient: Ingredient;
    unit_type: MeasurementUnitType;
    amount: number;
}

export interface Ingredient {
    id: number;
    names: IngredientName[];
}

export interface IngredientName {
    id: number;
    name: string;
    language: Language;
}

export interface NutritionalMeasurement {
    id: number;
    amount: number;
    type: NutritionalType;
    unit_type: MeasurementUnitType;
}

export interface NutritionalType {
    id: number;
    labels: NutritionalTypeLabel[];
}

export interface NutritionalTypeLabel {
    id: number;
    label: string;
    language: Language;
}

export interface MeasurementUnitType {
    id: number;
    type: string;
}

export interface Allergen {
    id: number;
    names: AllergenName[];
}

export interface AllergenName {
    id: number;
    name: string;
    language: Language;
}

export interface ProductName {
    id: number;
    name: string;
    language: Language;
}

export interface Language {
    id: number;
    name: string;
    code: string;
}

export interface Category {
    id: number;
    names: CategoryName[];
}

export interface CategoryName {
    id: number;
    name: string;
    language: Language;
}

export interface Seller {
    id: number;

    name: string;

    products: SellerProduct[];
    stores: SellerStore[];

    created_at?: string;
    updated_at?: string;
}

export interface SellerProduct {
    id: number;
    product: Product;
    recommendations: Product[];
}

export interface SellerStore {
    id: number;
    location: string;
}

export interface SellerListItem {
    id: number;

    name: string;

    products_count: number;
    stores_count: number;
}

export interface ProductListItem {
    id: number;

    manufacturer: Manufacturer;

    names: ProductName[];
    categories: Category[];

    images: Image[];
}

export interface PaginatedResponse<T> {
    data: T[];

    current_page: number;
    last_page: number;

    per_page: number;
    total: number;
}

export interface TranslationInput {
    language_id: number;
    value: string;
}

export interface RecipeRequest {
    names: TranslationInput[];
    contents: TranslationInput[];
    ingredients: number[];
}

export interface ProductIngredientRequest {
    ingredient_id: number;
    amount: number;
    unit_type_id: number;
}

export interface ProductNutritionRequest {
    nutritional_type_id: number;
    unit_type_id: number;
    amount: number;
}