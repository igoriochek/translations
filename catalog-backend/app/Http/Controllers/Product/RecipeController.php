<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecipeController extends Controller {
	public function index() {
		return Recipe::with(['names', 'contents', 'ingredients'])->get();
	}

    public function getRecipes($ingredientId) {
        return Recipe::with(['names', 'contents', 'ingredients'])
            ->whereHas('ingredients', function ($query) use ($ingredientId) {
                $query->where('products.id', $ingredientId);
            })
            ->get();
    }

    public function create(Request $request) {
        $validated = $request->validate([
            'names' => 'required|array',
            'names.*.language_id' => 'required|exists:languages,id',
            'names.*.name' => 'required|string',

            'contents' => 'required|array',
            'contents.*.language_id' => 'required|exists:languages,id',
            'contents.*.content' => 'required|string',

            'ingredients' => 'required|array',
            'ingredients.*' => 'required|exists:products,id',
        ]);

        $recipe = Recipe::create();

        $recipe->names()->createMany($validated['names']);
        $recipe->contents()->createMany($validated['contents']);
        $recipe->ingredients()->syncWithoutDetaching($validated['ingredients']);

        return response()->json($recipe->load(['names', 'contents', 'ingredients']), 201);
    }

    public function update($id, Request $request) {
        $request->merge(['id' => $id]);

        $validated = $request->validate([
            'id' => 'required|exists:recipes,id',
            'names' => 'required|array',
            'names.*.language_id' => 'required|exists:languages,id',
            'names.*.name' => 'required|string',
            'contents' => 'required|array',
            'contents.*.language_id' => 'required|exists:languages,id',
            'contents.*.content' => 'required|string',
            'ingredients' => 'required|array',
            'ingredients.*' => 'required|exists:products,id',
        ]);

        $recipe =
            Recipe::findOrFail(
                $validated['id']
            );

        DB::transaction(function () use ($recipe, $validated) {
            $recipe->names()->delete();
            $recipe->contents()->delete();

            $recipe->names()->createMany($validated['names']);
            $recipe->contents()->createMany($validated['contents']);

            $recipe->ingredients()->sync($validated['ingredients']);
        });

        return response()->json(
            $recipe->load([
                'names',
                'contents',
                'ingredients'
            ])
        );
    }

    public function delete(Request $request) {
        $request->merge(['id' => $request->route('id')]);
        $validated = $request->validate([
            'id' => 'exists:recipes,id',
        ]);

        Recipe::destroy($validated['id']);
        return response()->json(['message' => 'Deleted']);
    }
}
