<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;

class Certification extends Model {
	protected $fillable = [
        'label',
        'badge_url',
        'badge_path',
    ];

    protected $hidden = [
        'badge_path'
    ];
}
