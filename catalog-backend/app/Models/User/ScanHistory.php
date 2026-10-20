<?php

namespace App\Models\User;

use App\Models\Product\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScanHistory extends Model {
    protected $table = 'scan_history';
    protected $with = ['product'];

    protected $fillable = [
        'product_id',
        'user_id',
    ];

    protected static function booted()
    {
        static::saved(function (self $scan) {
            $keep = static::where('created_at', '>', now()->subDays(14))
                ->orderByDesc('created_at')
                ->orderByDesc('id')
                ->limit(40)
                ->pluck('id');

            static::where('created_at', '>', now()->subDays(14))
                ->whereNotIn('id', $keep)
                ->delete();
        });
    }

    public function product(): BelongsTo {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
