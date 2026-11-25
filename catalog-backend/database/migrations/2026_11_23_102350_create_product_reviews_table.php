<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void {
		Schema::create('product_reviews', function (Blueprint $table) {
			$table->id();
            $table->foreignId('user_id');
            $table->foreignId('product_id');
            $table->boolean('purchased');
            $table->boolean('recommended');
            $table->string('title');
            $table->string('content');
            $table->integer('rating');
			$table->timestamps();
		});
	}

	public function down(): void {
		Schema::dropIfExists('product_reviews');
	}
};
