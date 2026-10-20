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

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        Language::firstOrCreate(
            ['code' => 'en'],
            ['name' => 'English']
        );

        Language::firstOrCreate(
            ['code' => 'lt'],
            ['name' => 'Lietuvių']
        );

        $languages = Language::all();

        $manufacturers = $this->createManufacturers();

        $categories = $this->createCategories($languages);

        $ingredients = $this->createIngredients($languages);

        $allergens = $this->createAllergens($languages);

        $nutritionTypes = $this->createNutritionTypes($languages);

        $products = $this->createProducts(
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

    private function createManufacturers()
    {
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

    private function createCategories($languages)
    {
        $names = [
            'Dairy' => 'Pieno produktai',
            'Bakery' => 'Kepiniai',
            'Frozen' => 'Šaldyti produktai',
            'Beverages' => 'Gėrimai',
            'Snacks' => 'Užkandžiai',
            'Produce' => 'Vaisiai ir daržovės',
            'Seafood' => 'Jūros gėrybės',
            'Meat' => 'Mėsa',
            'Condiments' => 'Pagardai',
            'Canned Goods' => 'Konservuoti produktai'
        ];

        return collect($names)
            ->map(function ($ltName, $enName) use ($languages) {

                $category = Category::create();

                foreach ($languages as $language) {
                    $name = match ($language->code) {
                        'lt' => $ltName,
                        default => $enName
                    };

                    $category->names()->create([
                        'language_id' => $language->id,
                        'name' => $name
                    ]);
                }

                return $category;
            });
    }

    private function createIngredients($languages)
    {
        $names = [
            'Milk' => 'Pienas',
            'Flour' => 'Miltai',
            'Sugar' => 'Cukrus',
            'Salt' => 'Druska',
            'Butter' => 'Sviestas',
            'Chicken' => 'Vištiena',
            'Beef' => 'Jautiena',
            'Tomato' => 'Pomidoras',
            'Rice' => 'Ryžiai',
            'Cheese' => 'Sūris',
            'Garlic' => 'Česnakas',
            'Onion' => 'Svogūnas',
            'Egg' => 'Kiaušinis',
            'Potato' => 'Bulvė',
            'Pepper' => 'Pipirai'
        ];

        return collect($names)
            ->map(function ($ltName, $enName) use ($languages) {

                $ingredient = Ingredient::create();

                foreach ($languages as $language) {
                    $name = match ($language->code) {
                        'lt' => $ltName,
                        default => $enName
                    };

                    $ingredient->names()->create([
                        'language_id' => $language->id,
                        'name' => $name
                    ]);
                }

                return $ingredient;
            });
    }

    private function createAllergens($languages)
    {
        $names = [
            'Milk' => 'Pienas',
            'Egg' => 'Kiaušiniai',
            'Peanuts' => 'Žemės riešutai',
            'Soy' => 'Sojos',
            'Gluten' => 'Glitimas'
        ];

        return collect($names)
            ->map(function ($ltName, $enName) use ($languages) {

                $allergen = Allergen::create();

                foreach ($languages as $language) {
                    $name = match ($language->code) {
                        'lt' => $ltName,
                        default => $enName
                    };

                    $allergen->names()->create([
                        'language_id' => $language->id,
                        'name' => $name
                    ]);
                }

                return $allergen;
            });
    }

    private function createNutritionTypes($languages)
    {
        $names = [
            'Calories' => 'Kalorijos',
            'Protein' => 'Baltymai',
            'Fat' => 'Riebalai',
            'Carbohydrates' => 'Angliavandeniai',
            'Sugar' => 'Cukrus',
            'Sodium' => 'Natris'
        ];

        return collect($names)
            ->map(function ($ltName, $enName) use ($languages) {

                $type = NutritionalType::create();

                foreach ($languages as $language) {
                    $label = match ($language->code) {
                        'lt' => $ltName,
                        default => $enName
                    };

                    $type->labels()->create([
                        'language_id' => $language->id,
                        'label' => $label
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
            'Fresh' => 'Šviežias',
            'Organic' => 'Ekologiškas',
            'Premium' => 'Aukščiausios kokybės',
            'Golden' => 'Auksinis',
            'Classic' => 'Klasikinis',
            'Creamy' => 'Kreminis',
            'Smoked' => 'Rūkytas',
            'Roasted' => 'Skrudintas'
        ];

        $foods = [
            'Cheddar' => 'Čederis',
            'Yogurt' => 'Jogurtas',
            'Bread' => 'Duona',
            'Soup' => 'Sriuba',
            'Chicken Breast' => 'Vištienos krūtinėlė',
            'Salmon' => 'Lašiša',
            'Crackers' => 'Krekeriai',
            'Pasta' => 'Makaronai',
            'Ice Cream' => 'Ledai',
            'Apple Juice' => 'Obuolių sultys'
        ];

        $descriptions = [
            'Fresh' => [
                'en' => 'A fresh and carefully selected product suitable for everyday use.',
                'lt' => 'Šviežias ir kruopščiai atrinktas produktas, tinkamas kasdieniam vartojimui.'
            ],
            'Organic' => [
                'en' => 'An organic product made from carefully selected ingredients.',
                'lt' => 'Ekologiškas produktas, pagamintas iš kruopščiai atrinktų ingredientų.'
            ],
            'Premium' => [
                'en' => 'A premium product made with selected ingredients and attention to quality.',
                'lt' => 'Aukščiausios kokybės produktas, pagamintas iš atrinktų ingredientų, daug dėmesio skiriant kokybei.'
            ],
            'Golden' => [
                'en' => 'A carefully prepared product with a rich flavour and pleasant texture.',
                'lt' => 'Kruopščiai paruoštas produktas, pasižymintis sodriu skoniu ir malonia tekstūra.'
            ],
            'Classic' => [
                'en' => 'A classic product suitable for a variety of everyday meals.',
                'lt' => 'Klasikinis produktas, tinkamas įvairiems kasdieniams patiekalams.'
            ],
            'Creamy' => [
                'en' => 'A smooth and creamy product with a rich and pleasant taste.',
                'lt' => 'Švelnios ir kreminės tekstūros produktas, pasižymintis sodriu ir maloniu skoniu.'
            ],
            'Smoked' => [
                'en' => 'A smoked product with a distinctive flavour and aroma.',
                'lt' => 'Rūkytas produktas, pasižymintis išskirtiniu skoniu ir aromatu.'
            ],
            'Roasted' => [
                'en' => 'A roasted product prepared to provide a rich and satisfying flavour.',
                'lt' => 'Skrudintas produktas, paruoštas taip, kad pasižymėtų sodriu ir maloniu skoniu.'
            ]
        ];

        $products = collect();

        for ($i = 1; $i <= 1000; $i++) {

            $product = Product::create([
                'manufacturer_id' =>
                    $manufacturers->random()->id,

                'product_code' =>
                    'DEMO-' . str_pad($i, 5, '0', STR_PAD_LEFT)
            ]);

            $adjective = array_rand($adjectives);
            $food = array_rand($foods);

            $englishName =
                $adjective
                . ' '
                . $food;

            $lithuanianName =
                $adjectives[$adjective]
                . ' '
                . $foods[$food];

            foreach ($languages as $language) {

                $name = match ($language->code) {
                    'lt' => $lithuanianName,
                    default => $englishName
                };

                $product->names()->create([
                    'language_id' => $language->id,
                    'name' => $name
                ]);

                $description = $descriptions[$adjective][
                $language->code
                ] ?? $descriptions[$adjective]['en'];

                $product->descriptions()->create([
                    'language_id' => $language->id,
                    'description' => $description
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
                    'measurement_unit_type_id' => $type->id == 1 ? 4 : 1
                ]);
            }

            $products->push($product);
        }

        return $products;
    }

    private function createRecipes($languages, $ingredients)
    {
        for ($i = 0; $i < 200; $i++) {

            $recipe = Recipe::create();

            foreach ($languages as $language) {

                $name = match ($language->code) {
                    'lt' => 'Receptas ' . ($i + 1),
                    default => 'Recipe ' . ($i + 1)
                };

                $content = match ($language->code) {
                    'lt' => "1 žingsnis\n2 žingsnis\n3 žingsnis",
                    default => "Step 1\nStep 2\nStep 3"
                };

                $recipe->names()->create([
                    'language_id' => $language->id,
                    'name' => $name
                ]);

                $recipe->contents()->create([
                    'language_id' => $language->id,
                    'content' => $content
                ]);
            }

            $recipe->ingredients()->sync(
                $ingredients
                    ->random(rand(2, 6))
                    ->pluck('id')
            );
        }
    }

    private function createSellers($products)
    {
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
