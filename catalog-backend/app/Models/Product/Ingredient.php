<?php

namespace App\Models\Product;

use App\Models\Localization\IngredientName;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model {
    protected $with = [
        'names'
    ];

    public function names() {
        return $this->hasMany(IngredientName::class);
    }
}
