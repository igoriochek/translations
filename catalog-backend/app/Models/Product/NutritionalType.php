<?php

namespace App\Models\Product;

use App\Models\Localization\NutritionalTypeLabel;
use Illuminate\Database\Eloquent\Model;

class NutritionalType extends Model {
    protected $with = [
        'labels'
    ];

    public function labels() {
        return $this->hasMany(NutritionalTypeLabel::class);
    }
}
