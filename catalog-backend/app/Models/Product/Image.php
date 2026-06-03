<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Image extends Model {
	protected $fillable = [
		'product_id',
		'image_url',
        'image_path'
	];

    protected $hidden = [
        'image_path'
    ];

	public function product(): BelongsTo {
		return $this->belongsTo(Product::class);
	}
}
