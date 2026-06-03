<?php

namespace Database\Seeders;

use App\Models\User\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            [
                'email' => 'test@email.lnk'
            ],
            [
                'name' => 'Test account',
                'password' => Hash::make('TestPassword'),
                'role' => 'admin',
                'email_verified_at' => now()
            ]
        );
    }
}
