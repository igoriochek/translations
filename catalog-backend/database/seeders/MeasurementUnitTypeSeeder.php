<?php

namespace Database\Seeders;

use App\Models\Product\MeasurementUnitType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MeasurementUnitTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            'mass',
            'volume',
            'count',
            'none'
        ];

        foreach ($types as $type) {

            MeasurementUnitType::firstOrCreate([
                'type' => $type
            ]);
        }
    }
}
