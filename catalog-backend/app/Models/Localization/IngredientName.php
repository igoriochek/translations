<?php

namespace App\Models\Localization;

use App\Models\Product\Ingredient;
use Illuminate\Database\Eloquent\Model;

class IngredientName extends Model {
    protected $with = [
        'language'
    ];

    protected $fillable = [
        'name',
        'language_id'
    ];

    public function ingredient() {
        return $this->belongsTo(Ingredient::class);
    }

    public function language() {
        return $this->belongsTo(Language::class);
    }
}
