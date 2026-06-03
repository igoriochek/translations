<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\ManufacturerController;
use App\Http\Controllers\Product\AllergenController;
use App\Http\Controllers\Product\CategoryController;
use App\Http\Controllers\Product\IngredientController;
use App\Http\Controllers\Product\NutritionController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\RecipeController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/**
 * Login routes
 */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/**
 * User requests
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'get']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/allergens', [AllergenController::class, 'index']);
    Route::get('/manufacturers', [ManufacturerController::class, 'index']);
    Route::get('/languages', [LanguageController::class, 'index']);
    Route::get('/nutrition-types', [NutritionController::class, 'index']);
    Route::get('/sellers', [SellerController::class, 'index']);
    Route::get('/sellers/{id}', [SellerController::class, 'get']);
    Route::get('/ingredients', [IngredientController::class, 'index']);
    Route::get('/recipes', [RecipeController::class, 'index']);
    Route::get('/recipes/by-ingredients/{ingredientId}', [RecipeController::class, 'getRecipes']);

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/sellers/{id}/reviews', [UserController::class, 'createSellerReview']);
    Route::post('/manufacturers/{id}/reviews', [UserController::class, 'createManufacturerReview']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

/**
 * Admin requests
 */
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/sellers', [SellerController::class, 'list']);
    Route::get('/users', [UserController::class, 'get']);
    Route::get('/products', [ProductController::class, 'list']);
    Route::get('/products/all', [ProductController::class, 'all']);

    /**
     * Data input
     */
    Route::post('/products', [ProductController::class, 'create']);
    Route::post('/products/{id}/images', [ProductController::class, 'uploadImages']);
    Route::post('/languages', [LanguageController::class, 'create']);
    Route::post('/categories', [CategoryController::class, 'create']);
    Route::post('/allergens', [AllergenController::class, 'create']);
    Route::post('/ingredients', [IngredientController::class, 'create']);
    Route::post('/manufacturers', [ManufacturerController::class, 'create']);
    Route::post('/nutrition-types', [NutritionController::class, 'create']);
    Route::post('/recipes', [RecipeController::class, 'create']);

    Route::post('/sellers', [SellerController::class, 'create']);
    Route::post('/sellers/{id}/stores', [SellerController::class, 'addStore']);
    Route::post('/sellers/{id}/products', [SellerController::class, 'addProduct']);
    Route::post('/sellers/{sellerId}/products/{productId}/recommendations', [SellerController::class, 'addRecommendation']);

    Route::post('/users', [UserController::class, 'create']);

    /**
     * Data updates
     */
    Route::put('/manufacturers/{id}', [ManufacturerController::class, 'update']);
    Route::put('/languages/{id}', [LanguageController::class, 'update']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::put('/allergens/{id}', [AllergenController::class, 'update']);
    Route::put('/nutrition-types/{id}', [NutritionController::class, 'update']);
    Route::put('/ingredients/{id}', [IngredientController::class, 'update']);
    Route::put('/recipes/{id}', [RecipeController::class, 'update']);
    Route::put('/products/{id}', [ProductController::class, 'update']);

    /**
     * Data removal
     */
    Route::delete('/categories/{id}', [CategoryController::class, 'delete']);
    Route::delete('/allergens/{id}', [AllergenController::class, 'delete']);
    Route::delete('/ingredients/{id}', [IngredientController::class, 'delete']);
    Route::delete('/manufacturers/{id}', [ManufacturerController::class, 'delete']);
    Route::delete('/products/{id}', [ProductController::class, 'delete']);
    Route::delete('/products/{productId}/images/{imageId}', [ProductController::class, 'deleteImage']);
    Route::delete('/recipes/{id}', [RecipeController::class, 'delete']);
    Route::delete('/languages/{id}', [LanguageController::class, 'delete']);

    Route::delete('/sellers/{id}', [SellerController::class, 'delete']);
    Route::delete('/stores/{id}', [SellerController::class, 'deleteStore']);
    Route::delete('/sellers/{sellerId}/products/{productId}', [SellerController::class, 'deleteProduct']);
    Route::delete('/sellers/{sellerId}/products/{productId}/recommendations/{recommendationId}', [SellerController::class, 'deleteRecommendation']);

    Route::delete('/users/{id}', [UserController::class, 'delete']);
});
