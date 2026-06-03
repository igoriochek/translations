<?php

namespace App\Http\Controllers;

use App\Models\Localization\Language;
use Illuminate\Http\Request;

class LanguageController extends Controller {
	public function index() {
		return Language::all();
	}

    public function create(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string',
        ]);

        $language = Language::create($validated);

        return response()->json($language, 201);
    }

    public function update($id, Request $request) {
        $request->merge(['id' => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:languages,id',
            'name' => 'required|string',
            'code' => 'required|string'
        ]);

        language::whereId($validated['id'])->update([
            'name' => $validated['name'],
            'code' => $validated['code']
        ]);

        return response()->json(language::whereId($validated['id'])->first());
    }

    public function delete($id, Request $request) {
        $request->merge(['id' => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:languages,id'
        ]);

        language::whereId($validated['id'])->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
