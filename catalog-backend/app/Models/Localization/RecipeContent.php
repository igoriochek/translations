<?php

namespace App\Models\Localization;

use App\Models\Product\Recipe;
use Illuminate\Database\Eloquent\Model;

class RecipeContent extends Model {
    protected $with = [
        'language'
    ];

    protected $fillable = [
        'language_id',
        'content'
    ];

    public function recipe() {
        return $this->belongsTo(Recipe::class);
    }

    public function language() {
        return $this->belongsTo(Language::class);
    }
}
