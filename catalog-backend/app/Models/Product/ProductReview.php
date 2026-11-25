<?php

namespace App\Models\Product;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductReview extends Model {
	protected $fillable = [
		'title',
		'content',
		'rating',
		'product_id',
		'user_id',
		'purchased',
		'recommended',
	];

    protected $with = [
        'user'
    ];

	public function product(): BelongsTo {
		return $this->belongsTo(Product::class);
	}

	public function user(): BelongsTo {
		return $this->belongsTo(User::class);
	}

	protected function casts(): array {
		return [
			'purchased' => 'boolean',
			'recommended' => 'boolean',
		];
	}
}
