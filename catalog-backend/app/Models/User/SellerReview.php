<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerReview extends Model {
	protected $fillable = [
		'user_id',
		'seller_id',
		'title',
		'content',
	];

    protected $with = [
        'user'
    ];

	public function user(): BelongsTo {
		return $this->belongsTo(User::class);
	}

	public function seller(): BelongsTo {
		return $this->belongsTo(Seller::class);
	}
}
