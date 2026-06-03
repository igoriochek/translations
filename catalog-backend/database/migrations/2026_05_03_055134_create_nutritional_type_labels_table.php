<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nutritional_type_labels', function (Blueprint $table) {
            $table->id();
            $table->foreignId("language_id")
                ->constrained("languages")
                ->cascadeOnDelete();
            $table->foreignId('nutritional_type_id')
                ->constrained("nutritional_types")
                ->cascadeOnDelete();
            $table->string('label');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nutritional_type_labels');
    }
};
