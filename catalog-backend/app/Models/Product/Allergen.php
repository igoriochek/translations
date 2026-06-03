<?php

namespace App\Models\Product;

use App\Models\Localization\AllergenName;
use Illuminate\Database\Eloquent\Model;

class Allergen extends Model {
    protected $with = [
        'names'
    ];

    public function names() {
        return $this->hasMany(AllergenName::class);
    }
}
