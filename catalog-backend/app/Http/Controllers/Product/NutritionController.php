<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\NutritionalType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NutritionController extends Controller {
	public function index() {
		return NutritionalType::with('labels')->get();
	}

    public function create(Request $request) {
        $validated = $request->validate([
            'labels' => 'sometimes|array',
            'labels.*.language_id' => 'required|exists:languages,id',
            'labels.*.label' => 'required|string',
        ]);

        $type = NutritionalType::create();

        if(!empty($validated['labels'])) {
            $type->labels()->createMany($validated['labels']);
        }

        return $type->load('labels');
    }

    public function update($id, Request $request) {
        $request->merge(['id' => $id]);

        $validated = $request->validate([
            'id' => 'required|exists:nutritional_types,id',
            'labels' => 'required|array',
            'labels.*.language_id' => 'required|exists:languages,id',
            'labels.*.label' => 'required|string',
        ]);

        $type = NutritionalType::findOrFail($validated['id']);

        DB::transaction(function () use ($type, $validated) {
            $type->labels()->delete();
            $type->labels()->createMany($validated['labels']);
        });

        return response()->json($type->load('labels.language'));
    }

    public function delete($id) {
        $type = NutritionalType::find($id);

        if(!$type) return response()->json(['message' => 'Not found'], 404);

        $type->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
