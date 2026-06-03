<?php

namespace App\Models\User;

use App\Models\Product\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SellerProduct extends Model {
    protected $with = [
        'product',
        'recommendations'
    ];

    protected $fillable = [
        'product_id'
    ];

    public function seller(): BelongsTo {
        return $this->belongsTo(Seller::class);
    }

    public function product(): BelongsTo {
        return $this->belongsTo(Product::class);
    }

    public function recommendations(): BelongsToMany {
        return $this->belongsToMany(
            Product::class,
            'seller_recommendations',
            'seller_product_id',
            'product_id');
    }
}

