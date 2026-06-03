<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;

class ProductIngredient extends Model {
    protected $with = [
        'ingredient',
        'unitType'
    ];

    protected $fillable = [
        'product_id',
        'ingredient_id',
        'amount',
        'unit_type_id'
    ];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function ingredient() {
        return $this->belongsTo(Ingredient::class);
    }

    public function unitType() {
        return $this->belongsTo(MeasurementUnitType::class, 'unit_type_id');
    }
}
