<?php

namespace App\Models\Localization;

use Illuminate\Database\Eloquent\Model;

class Language extends Model {
    protected $fillable = [
        'name',
        'code'
    ];
}
