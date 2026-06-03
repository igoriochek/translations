<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ManufacturerReview extends Model {
	protected $fillable = [
		'user_id',
		'manufacturer_id',
		'title',
		'content',
	];

	public function user(): BelongsTo {
		return $this->belongsTo(User::class);
	}

	public function manufacturer(): BelongsTo {
		return $this->belongsTo(Manufacturer::class);
	}
}
