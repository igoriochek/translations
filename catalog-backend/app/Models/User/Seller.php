<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Seller extends Model {
    protected $fillable = [
        'name',
        'product_id'
    ];

    protected $withCount = [
        'stores'
    ];

    public function products(): Seller|HasMany {
        return $this->hasMany(SellerProduct::class);
    }

    public function stores(): Seller|HasMany {
        return $this->hasMany(SellerStore::class);
    }

    public function reviews(): Seller|HasMany {
        return $this->hasMany(SellerReview::class);
    }
}
