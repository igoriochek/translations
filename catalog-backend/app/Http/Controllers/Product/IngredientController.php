<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IngredientController extends Controller {
    public function index() {
        return Ingredient::with('names')->get();
    }

    public function create(Request $request) {
        $validated = $request->validate([
            'names' => 'sometimes|array',
            'names.*.language_id' => 'required|exists:languages,id',
            'names.*.name' => 'required|string',
        ]);

        $ingredient = Ingredient::create();

        if (!empty($validated['names'])) {
            $ingredient->names()->createMany($validated['names']);
        }

        return $ingredient->load('names');
    }

    public function update($id, Request $request) {
        $request->merge(['id' => $id]);

        $validated = $request->validate([
            'id' => 'required|exists:ingredients,id',
            'names' => 'required|array',
            'names.*.language_id' => 'required|exists:languages,id',
            'names.*.name' => 'required|string',
        ]);

        $ingredient = Ingredient::findOrFail($validated['id']);

        DB::transaction(function () use ($ingredient, $validated) {
            $ingredient
                ->names()
                ->delete();

            $ingredient
                ->names()
                ->createMany($validated['names']);
        });

        return response()->json($ingredient->load('names.language'));
    }

    public function delete($id) {
        $ingredient = Ingredient::find($id);

        if (!$ingredient) return response()->json(['message' => 'Not found'], 404);

        $ingredient->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
