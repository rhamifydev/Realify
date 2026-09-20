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
        Schema::create('property_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->string('day_of_week')->nullable(); // monday, tuesday, etc.
            $table->date('specific_date')->nullable(); // optional specific date override
            $table->time('start_time'); // stored as time, displayed in 12h AM/PM
            $table->time('end_time');   // stored as time, displayed in 12h AM/PM
            $table->unsignedSmallInteger('interval_minutes')->default(30); // 30, 45, 60
            $table->decimal('fee_amount', 12, 2)->default(5000.00); // customizable fee per interval
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['property_id', 'day_of_week']);
            $table->index(['property_id', 'specific_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_availabilities');
    }
};
