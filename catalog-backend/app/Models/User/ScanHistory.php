<?php

namespace App\Models\User;

use App\Models\Product\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScanHistory extends Model {
	protected $table = 'scan_history';

	protected $fillable = [
		'product_id',
		'user_id',
	];

	public function product(): BelongsTo {
		return $this->belongsTo(Product::class);
	}

	public function user(): BelongsTo {
		return $this->belongsTo(User::class);
	}
}
