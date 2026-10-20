<?php

namespace App\Models\Product;

use App\Models\Localization\Description;
use App\Models\Localization\ProductName;
use App\Models\User\Manufacturer;
use App\Models\User\SellerProduct;
use Illuminate\Database\Eloquent\Model;
use App\Models\Localization\UsageInstruction;

class Product extends Model {
    protected $with = [
        'manufacturer',
        'names',
        'descriptions',
        'categories',
        'images'
    ];

    protected $fillable = [
        'manufacturer_id',
        'product_code',
        'image_url',
        'image_path',
        'related_product_id'
    ];

    public function manufacturer() {
        return $this->belongsTo(Manufacturer::class);
    }

    public function sellers()
    {
        return $this->hasMany(SellerProduct::class);
    }

    public function ingredients() {
        return $this->hasMany(ProductIngredient::class);
    }

    public function names() {
        return $this->hasMany(ProductName::class);
    }

    public function descriptions() {
        return $this->hasMany(Description::class);
    }

    public function nutritionalMeasurements() {
        return $this->hasMany(NutritionalMeasurement::class);
    }

    public function categories() {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    public function relatedProducts() {
        return $this->belongsToMany(
            Product::class,
            'related_products',
            'product_id',
            'related_product_id'
        );
    }

    public function allergens() {
        return $this->belongsToMany(Allergen::class, 'product_allergens');
    }

    public function images() {
        return $this->hasMany(Image::class);
    }

    public function usageInstructions() {
        return $this->hasMany(UsageInstruction::class
        );
    }
}
