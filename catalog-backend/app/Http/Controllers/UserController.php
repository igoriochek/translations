<?php

namespace App\Http\Controllers;

use App\Models\Product\Product;
use App\Models\User\Manufacturer;
use App\Models\User\ManufacturerReview;
use App\Models\User\ScanHistory;
use App\Models\User\Seller;
use App\Models\User\SellerReview;
use App\Models\User\User;
use Hash;
use Illuminate\Http\Request;

class UserController extends Controller {
    public function get(Request $request) {
        return response()->json(User::whereNot('id', $request->user()->id)->get());
    }

	public function create(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin'
        ]);

        return response()->json($user);
	}

    public function delete($id, Request $request) {
        $request->merge(['id' => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:users,id'
        ]);

        $user = User::find($validated['id']);

        if($user == $request->user())
            return response()->json(['message' => 'Not allowed'], 405);

        $user->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function getSellerReviews($id, Request $request) {
        $request->merge(['id' => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:sellers,id'
        ]);

        return response()->json(SellerReview::where(['seller_id' => $id])->get());
    }

    public function createSellerReview($id, Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:1000'
        ]);

        if(!Seller::find($id)->exists())
            return response()->json(["message" => "Seller not found"], 404);

        $user = $request->user();

        if(!($user instanceof User))
            return response()->json(['message' => 'Unauthorized'], 401);

        $review = SellerReview::create([
            'user_id' => $user->id,
            'seller_id' => $id,
            'title' => $validated['title'],
            'content' => $validated['content']
        ]);

        return response()->json($review, 201);
    }

    public function updateSellerReview($id, Request $request) {
        $request->merge(['id' => $id]);
        $validated = $request->validate([
            'id' => 'exists:seller_reviews,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:1000'
        ]);

        $sellerReview = SellerReview::find($validated['id']);

        if($sellerReview->user() != $request->user())
            return response()->json(['message' => 'Unauthorized'], 401);

        $sellerReview->title = $validated['title'];
        $sellerReview->content = $validated['content'];
        $sellerReview->save();

        return response()->json($sellerReview);
    }

    public function deleteSellerReview($id, Request $request) {
        $request->merge(['id' => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:seller_reviews,id'
        ]);

        $sellerReview = SellerReview::find($validated['id']);
        if($sellerReview->user() != $request->user())
            return response()->json(['message' => 'Unauthorized'], 401);

        $sellerReview->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function getManufacturerReviews($id, Request $request) {
        $request->merge(['id' => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:manufacturers,id'
        ]);

        return response()->json(ManufacturerReview::where(['manufacturer_id' => $id])->get());
    }

    public function createManufacturerReview($id, Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:1000'
        ]);

        if(Manufacturer::find($id) == null)
            return response()->json(["message" => "Manufacturer not found"], 404);

        $user = $request->user();

        if(!($user instanceof User))
            return response()->json(['message' => 'Unauthorized'], 401);

        $review = ManufacturerReview::create([
            'user_id' => $user->id,
            'manufacturer_id' => $id,
            'title' => $validated['title'],
            'content' => $validated['content']
        ]);

        return response()->json($review, 201);
    }

    public function updateManufacturerReview($id, Request $request) {
        $request->merge(['id' => $id]);
        $validated = $request->validate([
            'id' => 'exists:manufacturer_reviews,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:1000'
        ]);

        $manufacturerReview = ManufacturerReview::find($validated['id']);

        if($manufacturerReview->user() != $request->user())
            return response()->json(['message' => 'Unauthorized'], 401);

        $manufacturerReview->title = $validated['title'];
        $manufacturerReview->content = $validated['content'];
        $manufacturerReview->save();

        return response()->json($manufacturerReview);
    }

    public function deleteManufacturerReview($id, Request $request) {
        $request->merge(['id' => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:manufacturer_reviews,id'
        ]);

        $manufacturerReview = ManufacturerReview::find($validated['id']);
        if($manufacturerReview->user() != $request->user())
            return response()->json(['message' => 'Unauthorized'], 401);

        $manufacturerReview->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function addSearchResult($productId, Request $request) {
        $request->merge(['id' => $productId]);
        $validated = $request->validate([
            'id' => 'required|exists:products,id'
        ]);

        $product = Product::find($validated['id']);
        $scan = ScanHistory::create(['user_id' => $request->user()->id, 'product_id' => $product->id]);

        return response()->json($scan, 201);
    }

    public function getScanHistory(Request $request) {
        $user = $request->user();
        $list = ScanHistory::where(['user_id' => $user->id])->orderByDesc('created_at')->get();
        return response()->json($list);
    }
}
