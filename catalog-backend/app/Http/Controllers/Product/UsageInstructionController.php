<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Localization\UsageInstruction;
use Illuminate\Http\Request;

class UsageInstructionController extends Controller {
    public function create($productId, Request $request) {
        $validated = $request->validate([
            'language_id' => 'required|exists:languages,id',
            'content' => 'required|string|max:1000'
        ]);

        return response()->json(UsageInstruction::create([
            'product_id' => $productId,
            'language_id' => $validated['language_id'],
            'content' => $validated['content']
        ])->load("language"), 201);
    }

    public function update($id, Request $request) {
        $validated = $request->validate([
            'content' => 'required|string|max:1000'
        ]);

        $instruction = UsageInstruction::findOrFail($id);

        $instruction->content = $validated['content'];
        $instruction->save();

        return $instruction;
    }

    public function delete($id) {
        UsageInstruction::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Deleted'
        ]);
    }
}
