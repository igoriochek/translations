<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Manufacturer extends Model {
    protected $fillable = [
        'name',
        'country'
    ];
}
