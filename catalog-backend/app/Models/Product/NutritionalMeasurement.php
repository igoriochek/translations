<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;

class NutritionalMeasurement extends Model {
    protected $with = [
        'type',
        'unitType'
    ];

    protected $fillable = [
        'product_id',
        'amount',
        'measurement_unit_type_id',
        'nutritional_type_id'
    ];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function type() {
        return $this->hasOne(NutritionalType::class, 'id', 'nutritional_type_id');
    }

    public function unitType() {
        return $this->hasOne(MeasurementUnitType::class, 'id', 'measurement_unit_type_id');
    }
}
