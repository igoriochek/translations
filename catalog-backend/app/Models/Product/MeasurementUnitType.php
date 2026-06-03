<?php

namespace App\Models\Product;

use App\Models\Localization\NutritionalTypeLabel;
use Illuminate\Database\Eloquent\Model;

class MeasurementUnitType extends Model {
    protected $fillable = ['type'];
}
