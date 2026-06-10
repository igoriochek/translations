<?php

namespace App\Http\Controllers;

use App\Models\User\Seller;
use App\Models\User\SellerStore;
use Illuminate\Http\Request;

class SellerController extends Controller {
    const array RELATIONS = ['products' => ['recommendations', 'product'], 'stores', 'reviews'];

    public function index() {
		return Seller::with(self::RELATIONS)->get();
	}

    public function list() {
        return Seller::withCount([
            'stores',
            'products'
        ])->get();
    }

    public function get(Request $request, $id) {
        $request->merge(["id" => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:sellers,id'
        ]);

        return Seller::with(self::RELATIONS)->find($validated["id"]);
    }

    public function create(Request $request) {
        $validated = $request->validate([
            'name' => 'required',
        ]);

        $seller = Seller::create($validated);

        return response()->json(Seller::whereId($seller->id)->withCount([
            'stores',
            'products'
        ])->get()->first(), 201);
    }

    public function addProduct($id, Request $request) {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'recommendations' => 'sometimes|array',
            'recommendations.*.product_id' => 'required|exists:products,id',
        ]);

        $seller = Seller::find($id);

        if(!$seller)
            return response()->json(["message" => "Seller not found"], 404);

        $product = $seller->products()->create([
            'product_id' => $validated['product_id'],
        ]);

        $product->recommendations()->createMany($validated['recommendations']);

        return response()->json($seller->load(self::RELATIONS), 201);
    }

    public function addRecommendation($sellerId, $productId, Request $request) {
        $validated = $request->validate([
            'recommendations' => 'required|array',
            'recommendations.*' => 'required|exists:products,id'
        ]);

        $seller = Seller::find($sellerId);
        if (!$seller)
            return response()->json(['message' => 'Seller not found'], 404);

        $product = $seller->products()->find($productId);
        if (!$product)
            return response()->json(['message' => 'Product not found'], 404);

        $product->recommendations()->sync($validated['recommendations']);

        return response()->json($seller->load(self::RELATIONS));
    }

    public function addStore($id, Request $request) {
        $request->merge(["id" => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:sellers,id',
            'location' => 'required|string',
        ]);

        $seller = Seller::find($id);

        $store = $seller->stores()->create($validated);

        return response()->json($store, 201);
    }

    public function delete($id, Request $request) {
        $request->merge(["id" => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:sellers,id',
        ]);

        $seller = Seller::find($validated['id']);
        $seller->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function deleteStore($id, Request $request) {
        $request->merge([
            "id" => $id,
        ]);

        $validated = $request->validate([
            "id" => "required|exists:seller_stores,id",
        ]);

        $store = SellerStore::find($validated['id']);
        $store->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function deleteProduct($sellerId, $productId) {
        $seller = Seller::find($sellerId);
        if (!$seller)
            return response()->json(['message' => 'Seller not found'], 404);

        $product = $seller->products()->find($productId);
        if (!$product)
            return response()->json(['message' => 'Product not found'], 404);

        $product->delete();
        return response()->json($seller->load(self::RELATIONS));
    }

    public function deleteRecommendation(
        $sellerId,
        $productId,
        $recommendationId
    ) {
        $seller = Seller::find($sellerId);
        if (!$seller)
            return response()->json(['message' => 'Seller not found'], 404);

        $product = $seller->products()->find($productId);
        if (!$product)
            return response()->json(['message' => 'Product not found'], 404);

        $product->recommendations()->detach($recommendationId);
        return response()->json($seller->load(self::RELATIONS));
    }
}
