<?php

namespace App\Models\Localization;

use App\Models\Product\Allergen;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AllergenName extends Model {
    protected $with = [
        'language'
    ];

    protected $fillable = [
		'language_id',
		'allergen_id',
		'name',
	];

	public function language(): BelongsTo {
		return $this->belongsTo(Language::class);
	}

	public function allergen(): BelongsTo {
		return $this->belongsTo(Allergen::class);
	}
}
