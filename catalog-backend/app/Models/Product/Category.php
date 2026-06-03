<?php

namespace App\Models\Product;

use App\Models\Localization\CategoryName;
use Illuminate\Database\Eloquent\Model;

class Category extends Model {
    protected $with = ['names'];

    public function names() {
        return $this->hasMany(CategoryName::class);
    }
}
