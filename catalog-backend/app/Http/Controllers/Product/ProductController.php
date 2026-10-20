<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\Product;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

const relations = [
    'manufacturer',
    'sellers.seller',
    'sellers.recommendations',
    'names',
    'ingredients',
    'nutritionalMeasurements',
    'categories',
    'allergens',
    'images',
    'relatedProducts',
    'usageInstructions',
];

class ProductController extends Controller {
    public function index(Request $request) {
        $query = Product::query();

        $query = $this->applyFilters($query, $request);

        return $query->with(relations)->paginate($request->perPage ?? 20);
    }

    public function get($id, Request $request) {
        $request->merge(['id' => $id]);
        $validated = request()->validate([
           'id' => 'exists:products,id'
        ]);

        return response()->json(Product::whereId($id)->with(relations)->first());
    }

    public function findByCode($code, Request $request) {
        $request->merge(['code' => $code]);
        $validated = request()->validate([
            'code' => 'exists:products,product_code'
        ]);

        return response()->json(Product::where('product_code', $code)->with(relations)->first());
    }

    public function list(Request $request) {
        $query = Product::query();
        $query = $this->applyFilters($query, $request);
        $products = $query->with([
            'manufacturer',
            'names',
            'categories',
            'images'
        ]);
        return $products->paginate($request->perPage ?? 20);
    }

    public function all() {
        return Product::query()
            ->with([
                'manufacturer',
                'names',
                'categories',
                'images'
            ])
            ->get();
    }

    public function create(Request $request) {
        $this->parseJsonField($request, 'names');
        $this->parseJsonField($request, 'categories');
        $this->parseJsonField($request, 'allergens');
        $this->parseJsonField($request, 'related_products');
        $this->parseJsonField($request, 'ingredients');
        $this->parseJsonField($request, 'nutritional_measurements');

        $validated = $request->validate([
            'product_code' => 'required|string|max:255',
            'manufacturer_id' => 'required|exists:manufacturers,id',

            'names' => 'sometimes|array',
            'names.*.language_id' => 'required|exists:languages,id',
            'names.*.name' => 'required|string',

            'descriptions' => 'sometimes|array',
            'descriptions.*.language_id' => 'required|exists:languages,id',
            'descriptions.*.description' => 'required|string',

            'categories' => 'sometimes|array',
            'categories.*' => 'exists:categories,id',

            'allergens' => 'sometimes|array',
            'allergens.*' => 'exists:allergens,id',

            'ingredients' => 'sometimes|array',
            'ingredients.*.ingredient_id' => 'required|exists:ingredients,id',
            'ingredients.*.amount' => 'required|numeric',
            'ingredients.*.unit_type_id' => 'required|exists:measurement_unit_types,id',

            'images' => 'sometimes|array',
            'images.*' => 'file|image|max:65536',

            'related_products' => 'sometimes|array',
            'related_products.*' => 'exists:products,id',

            'nutritional_measurements' => 'sometimes|array',
            'nutritional_measurements.*.nutritional_type_id' => 'required|exists:nutritional_types,id',
            'nutritional_measurements.*.amount' => 'required|numeric',
            'nutritional_measurements.*.measurement_unit_type_id' => 'required|exists:measurement_unit_types,id',
        ]);

        return DB::transaction(function () use ($request, $validated) {

            $product = Product::create([
                'product_code' => $validated['product_code'],
                'manufacturer_id' => $validated['manufacturer_id'],
            ]);

            // Names
            if (!empty($validated['names'])) {
                foreach ($validated['names'] as $name) {
                    $product->names()->create($name);
                }
            }

            if (!empty($validated['descriptions'])) {
                foreach ($validated['descriptions'] as $description) {
                    $product->descriptions()->create($description);
                }
            }

            if (!empty($validated['categories'])) {
                $product->categories()->sync($validated['categories']);
            }

            if (!empty($validated['allergens'])) {
                $product->allergens()->sync($validated['allergens']);
            }

            if (!empty($validated['ingredients'])) {
                $product->ingredients()->createMany($validated['ingredients']);
            }

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {

                    $path = $file->store('products', 'public');

                    $product->images()->create([
                        'image_url' => url('storage/' . $path),
                        'image_path' => $path,
                    ]);
                }
            }

            if (!empty($validated['related_products'])) {
                foreach ($validated['related_products'] as $relatedId) {
                    $product->relatedProducts()->syncWithoutDetaching($relatedId);

                    Product::find($relatedId)
                        ->relatedProducts()
                        ->syncWithoutDetaching($product->id);
                }
            }

            if (!empty($validated['nutritional_measurements'])) {
                $product->nutritionalMeasurements()->createMany($validated['nutritional_measurements']);
            }

            return response()->json($product->load(relations), 201);
        });
    }

    public function update($id, Request $request) {
        $product = Product::find($id);

        if (!$product)
            return response()->json(['message' => 'Product not found'], 404);

        $validated = $request->validate([
            'names' => 'sometimes|array',
            'names.*.language_id' => 'required|exists:languages,id',
            'names.*.name' => 'required|string',

            'descriptions' => 'sometimes|array',
            'descriptions.*.language_id' => 'required|exists:languages,id',
            'descriptions.*.description' => 'required|string',

            'categories' => 'sometimes|array',
            'categories.*' => 'exists:categories,id',

            'allergens' => 'sometimes|array',
            'allergens.*' => 'exists:allergens,id',

            'related_products' => 'sometimes|array',
            'related_products.*' => 'exists:products,id',

            'ingredients' => 'sometimes|array',
            'ingredients.*.ingredient_id' => 'required|exists:ingredients,id',
            'ingredients.*.amount' => 'required|numeric',
            'ingredients.*.unit_type_id' => 'required|exists:measurement_unit_types,id',

            'nutritional_measurements' => 'sometimes|array',
            'nutritional_measurements.*.nutritional_type_id' => 'required|exists:nutritional_types,id',
            'nutritional_measurements.*.amount' => 'required|numeric',
            'nutritional_measurements.*.measurement_unit_type_id' => 'required|exists:measurement_unit_types,id',
        ]);

        if (isset($validated['names'])) {
            $product->names()->delete();
            $product->names()->createMany($validated['names']);
        }

        if(isset($validated['descriptions'])) {
            $product->categories()->delete();
            $product->categories()->createMany($validated['descriptions']);
        }

        if (isset($validated['categories']))
            $product->categories()->sync($validated['categories']);

        if (isset($validated['allergens']))
            $product->allergens()->sync($validated['allergens']);

        if (isset($validated['related_products']))
            $product->relatedProducts()->sync($validated['related_products']);

        if (isset($validated['nutritional_measurements'])) {
            $product->nutritionalMeasurements()->delete();
            $product->nutritionalMeasurements()->createMany($validated['nutritional_measurements']);
        }

        if (isset($validated['ingredients'])) {
            $product->ingredients()->delete();
            $product->ingredients()->createMany($validated['ingredients']);
        }

        return response()->json($product->load(relations));
    }

    public function uploadImages($id, Request $request) {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'file|image|max:65536',
        ]);

        $product = Product::find($id);

        if (!$product)
            return response()->json(['message' => 'Product not found'], 404);

        foreach ($request->file('images') as $file) {
            $path = $file->store('products', 'public');

            $product->images()->create([
                'image_url' => url('storage/' . $path),
                'image_path' => $path,
            ]);
        }

        return response()->json($product->load(relations));
    }

    public function deleteImage($productId, $imageId) {
        $product = Product::find($productId);
        if (!$product)
            return response()->json(['message' => 'Product not found'], 404);

        $image = $product->images()->find($imageId);

        if (!$image)
            return response()->json(['message' => 'Image not found'], 404);

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json($product->load(relations));
    }

    public function delete($id) {
        $product = Product::find($id);

        if (!$product) return response()->json(['message' => 'Not found'], 404);

        foreach ($product->images as $image) {

            Storage::disk('public')->delete($image->image_path);
        }

        $product->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function applyFilters($query, Request $request) {
        $this->parseJsonField($request, 'manufacturer_ids');
        $this->parseJsonField($request, 'category_ids');
        $this->parseJsonField($request, 'allergen_ids');

        // Manufacturer filter
        if ($request->filled('manufacturer_ids')) {
            $query->whereIn('manufacturer_id', $request->manufacturer_ids);
        }

        // Product code
        if ($request->filled('product_code')) {
            $query->where('product_code', 'like', '%' . $request->product_code . '%');
        }

        // Name (localized)
        if ($request->filled('name')) {
            $query->whereHas('names', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->name . '%');
            });
        }

        // Category
        if ($request->filled('category_ids')) {
            $query->whereDoesntHave('categories', function ($q) use ($request) {
                $q->whereNotIn('categories.id', $request->category_ids);
            });
        }

        // Allergen
        if ($request->filled('allergen_ids')) {
            $query->whereDoesntHave('allergens', function ($q) use ($request) {
                $q->whereNotIn('allergens.id', $request->allergen_ids);
            });
        }

        return $query;
    }

    private function parseJsonField(Request $request, string $field): void {
        $value = $request->input($field);

        if (is_string($value)) {
            $decoded = json_decode($value, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                $request->merge([
                    $field => $decoded
                ]);
            }
        }
    }
}
