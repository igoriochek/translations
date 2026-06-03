<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\Allergen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AllergenController extends Controller
{
    public function index()
    {
        return Allergen::with('names')->get();
    }

    public function create(Request $request) {
        $validated = $request->validate([
            'names' => 'sometimes|array',
            'names.*.language_id' => 'required|exists:languages,id',
            'names.*.name' => 'required|string',
        ]);

        $allergen = Allergen::create();

        if (!empty($validated['names'])) {
            $allergen->names()->createMany($validated['names']);
        }

        return response()->json($allergen->load(['names']), 201);
    }

    public function update($id, Request $request) {
        $request->merge([
            'id' => $id
        ]);

        $validated = $request->validate([
            'id' => 'required|exists:allergens,id',

            'names' => 'required|array',

            'names.*.language_id' =>
                'required|exists:languages,id',

            'names.*.name' =>
                'required|string',
        ]);

        $allergen =
            Allergen::findOrFail(
                $validated['id']
            );

        DB::transaction(function ()
        use (
            $allergen,
            $validated
        ) {

            $allergen
                ->names()
                ->delete();

            $allergen
                ->names()
                ->createMany(
                    $validated['names']
                );
        });

        return response()->json(
            $allergen->load(
                'names.language'
            )
        );
    }

    public function delete($id) {
        $allergen = Allergen::find($id);

        if (!$allergen) return response()->json(['message' => 'Not found'], 404);

        $allergen->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
