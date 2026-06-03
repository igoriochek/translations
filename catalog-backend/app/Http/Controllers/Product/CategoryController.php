<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller {
    public function index() {
        return Category::with('names')->get();
    }

    public function create(Request $request) {
        $validated = $request->validate([
            'names' => 'sometimes|array',
            'names.*.language_id' => 'required|exists:languages,id',
            'names.*.name' => 'required|string',
        ]);

        $category = Category::create();

        if (!empty($validated['names'])) {
            $category->names()->createMany($validated['names']);
        }

        return response()->json($category->load(['names']), 201);
    }

    public function update(
        $id,
        Request $request
    ) {
        $request->merge(['id' => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:categories,id',
            'names' => 'required|array',
            'names.*.language_id' => 'required|exists:languages,id',
            'names.*.name' => 'required|string',
        ]);

        $category = Category::findOrFail($validated['id']);

        DB::transaction(function () use ($category, $validated) {
            $category->names()->delete();
            $category->names()->createMany($validated['names']);
        });

        return response()->json(
            $category->load('names.language')
        );
    }

    public function delete($id) {
        $category = Category::find($id);

        if (!$category) return response()->json(['message' => 'Not found'], 404);

        $category->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
