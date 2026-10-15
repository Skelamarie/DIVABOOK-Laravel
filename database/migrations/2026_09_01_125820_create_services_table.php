<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('admin_id');
            $table->string('name');
            $table->string('category');
            $table->text('description')->nullable();
            $table->string('rate');
            $table->json('photos')->nullable();
            $table->timestamps();

            $table->foreign('admin_id')->references('admin_id')->on('partners')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
