<?php

namespace App\Models\Localization;

use App\Models\Product\Category;
use Illuminate\Database\Eloquent\Model;

class CategoryName extends Model {
    protected $with = [
        'language'
    ];

    protected $fillable = [
        'name',
        'language_id'
    ];

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function language() {
        return $this->belongsTo(Language::class);
    }
}
