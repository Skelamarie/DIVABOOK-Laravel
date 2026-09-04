<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('admin_id');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone');
            $table->string('service');
            $table->string('service_name');
            $table->integer('service_price')->default(0);
            $table->string('size')->nullable();
            $table->string('size_name')->nullable();
            $table->integer('size_price')->default(0);
            $table->string('addon')->nullable();
            $table->string('addon_name')->nullable();
            $table->integer('addon_price')->default(0);
            $table->boolean('removal')->default(false);
            $table->integer('removal_price')->default(0);
            $table->string('selected_date');
            $table->string('selected_time');
            $table->text('special_requests')->nullable();
            $table->integer('total_price')->default(0);
            $table->integer('amount_paid')->default(0);
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('Pending');
            $table->string('sender_name')->nullable();
            $table->string('receipt_path')->nullable();
            $table->string('reference_image')->nullable();
            $table->boolean('provider_chooses')->default(false);
            $table->string('status')->default('Pending');
            $table->timestamps();

            $table->foreign('admin_id')->references('admin_id')->on('partners')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};