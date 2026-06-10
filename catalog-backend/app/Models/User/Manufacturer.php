<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Manufacturer extends Model {
    protected $fillable = [
        'name',
        'country'
    ];

    public function reviews(): Manufacturer|HasMany {
        return $this->hasMany(ManufacturerReview::class);
    }
}
