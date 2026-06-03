<?php

namespace App\Models\Localization;

use App\Models\Product\Product;
use Illuminate\Database\Eloquent\Model;

class Description extends Model {
    protected $with = [
        'language'
    ];

    protected $fillable = [
        'description'
    ];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function language() {
        return $this->belongsTo(Language::class);
    }
}
