<?php

namespace App\Models\Localization;

use App\Models\Product\NutritionalType;
use Illuminate\Database\Eloquent\Model;

class NutritionalTypeLabel extends Model {
    protected $with = [
        'language'
    ];

    protected $fillable = [
        'label',
        'language_id'
    ];

    public function language() {
        return $this->belongsTo(Language::class);
    }

    public function type() {
        return $this->belongsTo(NutritionalType::class, 'nutritional_type_id');
    }
}
