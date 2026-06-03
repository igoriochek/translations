<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Localization\Language;
use App\Models\Product\Category;
use App\Models\Product\Ingredient;
use App\Models\Product\Allergen;
use App\Models\Product\NutritionalType;
use App\Models\Product\Product;
use App\Models\Product\Recipe;
use App\Models\User\Manufacturer;
use App\Models\User\Seller;

class DemoDataSeeder extends Seeder {

    public function run(): void {
        Language::firstOrCreate(['code' => 'en'], ['name' => 'English']);

        $languages = Language::all();

        $manufacturers =
            $this->createManufacturers();

        $categories =
            $this->createCategories($languages);

        $ingredients =
            $this->createIngredients($languages);

        $allergens =
            $this->createAllergens($languages);

        $nutritionTypes =
            $this->createNutritionTypes($languages);

        $products =
            $this->createProducts(
                $languages,
                $manufacturers,
                $categories,
                $ingredients,
                $allergens,
                $nutritionTypes
            );

        $this->createRecipes(
            $languages,
            $ingredients
        );

        $this->createSellers(
            $products
        );
    }

    private function createManufacturers() {

        $names = [
            'North Valley Foods',
            'Fresh Horizon',
            'Golden Grove',
            'Harvest Select',
            'Riverbend Foods',
            'Summit Organics',
            'Oak & Stone',
            'Silver Creek',
            'Green Meadow',
            'Blue Ridge Farms'
        ];

        return collect($names)
            ->map(fn ($name) =>
            Manufacturer::create([
                'name' => $name
            ])
            );
    }

    private function createCategories($languages) {

        $names = [
            'Dairy',
            'Bakery',
            'Frozen',
            'Beverages',
            'Snacks',
            'Produce',
            'Seafood',
            'Meat',
            'Condiments',
            'Canned Goods'
        ];

        return collect($names)
            ->map(function ($name) use ($languages) {

                $category = Category::create();

                foreach ($languages as $language) {

                    $category->names()->create([
                        'language_id' => $language->id,
                        'name' => $name
                    ]);
                }

                return $category;
            });
    }

    private function createIngredients($languages) {

        $names = [
            'Milk',
            'Flour',
            'Sugar',
            'Salt',
            'Butter',
            'Chicken',
            'Beef',
            'Tomato',
            'Rice',
            'Cheese',
            'Garlic',
            'Onion',
            'Egg',
            'Potato',
            'Pepper'
        ];

        return collect($names)
            ->map(function ($name) use ($languages) {

                $ingredient = Ingredient::create();

                foreach ($languages as $language) {

                    $ingredient->names()->create([
                        'language_id' => $language->id,
                        'name' => $name
                    ]);
                }

                return $ingredient;
            });
    }

    private function createAllergens($languages) {

        $names = [
            'Milk',
            'Egg',
            'Peanuts',
            'Soy',
            'Gluten'
        ];

        return collect($names)
            ->map(function ($name) use ($languages) {

                $allergen = Allergen::create();

                foreach ($languages as $language) {

                    $allergen->names()->create([
                        'language_id' => $language->id,
                        'name' => $name
                    ]);
                }

                return $allergen;
            });
    }

    private function createNutritionTypes($languages) {

        $names = [
            'Calories',
            'Protein',
            'Fat',
            'Carbohydrates',
            'Sugar',
            'Sodium'
        ];

        return collect($names)
            ->map(function ($name) use ($languages) {

                $type = NutritionalType::create();

                foreach ($languages as $language) {

                    $type->labels()->create([
                        'language_id' => $language->id,
                        'label' => $name
                    ]);
                }

                return $type;
            });
    }

    private function createProducts(
        $languages,
        $manufacturers,
        $categories,
        $ingredients,
        $allergens,
        $nutritionTypes
    ) {

        $adjectives = [
            'Fresh',
            'Organic',
            'Premium',
            'Golden',
            'Classic',
            'Creamy',
            'Smoked',
            'Roasted'
        ];

        $foods = [
            'Cheddar',
            'Yogurt',
            'Bread',
            'Soup',
            'Chicken Breast',
            'Salmon',
            'Crackers',
            'Pasta',
            'Ice Cream',
            'Apple Juice'
        ];

        $products = collect();

        for ($i = 1; $i <= 1000; $i++) {

            $product = Product::create([
                'manufacturer_id' =>
                    $manufacturers->random()->id,

                'product_code' =>
                    'DEMO-' . str_pad($i, 5, '0', STR_PAD_LEFT)
            ]);

            $name =
                $adjectives[array_rand($adjectives)]
                . ' '
                . $foods[array_rand($foods)];

            foreach ($languages as $language) {

                $product->names()->create([
                    'language_id' => $language->id,
                    'name' => $name
                ]);
            }

            $product->categories()->syncWithoutDetaching(
                $categories
                    ->random(rand(1, 3))
                    ->pluck('id')
            );

            $product->allergens()->syncWithoutDetaching(
                $allergens
                    ->random(rand(0, 2))
                    ->pluck('id')
            );

            foreach (
                $ingredients->random(rand(2, 8))
                as $ingredient
            ) {

                $product->ingredients()->create([
                    'ingredient_id' => $ingredient->id,
                    'amount' => rand(1, 500),
                    'unit_type_id' => 1
                ]);
            }

            foreach ($nutritionTypes as $type) {

                $product->nutritionalMeasurements()->create([
                    'nutritional_type_id' => $type->id,
                    'amount' => rand(1, 100),
                    'measurement_unit_type_id' => 1
                ]);
            }

            $products->push($product);
        }

        return $products;
    }

    private function createRecipes($languages, $ingredients) {

        for ($i = 0; $i < 200; $i++) {

            $recipe = Recipe::create();

            foreach ($languages as $language) {

                $recipe->names()->create([
                    'language_id' => $language->id,
                    'name' => 'Recipe ' . ($i + 1)
                ]);

                $recipe->contents()->create([
                    'language_id' => $language->id,
                    'content' =>
                        "Step 1\nStep 2\nStep 3"
                ]);
            }

            $recipe->ingredients()->sync(
                $ingredients
                    ->random(rand(2, 6))
                    ->pluck('id')
            );
        }
    }

    private function createSellers($products) {

        for ($i = 1; $i <= 50; $i++) {

            $seller = Seller::create([
                'name' => 'Seller ' . $i
            ]);

            $seller->stores()->create([
                'location' => 'Store ' . $i
            ]);

            foreach (
                $products->random(rand(10, 30))
                as $product
            ) {

                $sellerProduct =
                    $seller->products()->create([
                        'product_id' => $product->id
                    ]);

                $sellerProduct
                    ->recommendations()
                    ->syncWithoutDetaching(
                        $products
                            ->random(rand(2, 5))
                            ->pluck('id')
                    );
            }
        }
    }
}
