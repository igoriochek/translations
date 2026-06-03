<?php

namespace App\Http\Controllers;

use App\Models\Product\Product;
use App\Models\Product\Recipe;
use App\Models\User\Seller;
use App\Models\User\Manufacturer;
use App\Models\User\User;

class DashboardController extends Controller {

    public function stats() {

        return response()->json([
            'products' => Product::count(),
            'recipes' => Recipe::count(),
            'sellers' => Seller::count(),
            'manufacturers' => Manufacturer::count(),
            'users' => User::where('role', '=', 'admin')->count(),
        ]);
    }
}
