<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class SellerStore extends Model {
    protected $fillable = [
        'location',
        'seller_id'
    ];

    public function seller() {
        return $this->belongsTo(Seller::class);
    }
}
