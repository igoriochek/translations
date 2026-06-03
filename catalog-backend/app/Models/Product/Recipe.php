<?php

namespace App\Models\Product;

use App\Models\Localization\RecipeContent;
use App\Models\Localization\RecipeName;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model {
    protected $with = [
        'names',
        'ingredients',
        'contents'
    ];

    public function names() {
        return $this->hasMany(RecipeName::class);
    }

    public function contents() {
        return $this->hasMany(RecipeContent::class);
    }

    public function ingredients() {
        return $this->belongsToMany(Product::class, 'recipe_ingredients', 'recipe_id', 'product_id');
    }
}
