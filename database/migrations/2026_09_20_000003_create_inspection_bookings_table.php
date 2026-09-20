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
        Schema::create('inspection_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->foreignId('property_unit_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('tenant_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('agent_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('transaction_id')->nullable()->constrained()->nullOnDelete();
            $table->date('inspection_date');
            $table->time('start_time'); // stored as time, formatted as 12-hour AM/PM in UI
            $table->time('end_time');   // stored as time, formatted as 12-hour AM/PM in UI
            $table->unsignedSmallInteger('interval_minutes')->default(30); // 30, 45, 60
            $table->decimal('fee_amount', 12, 2)->default(5000.00);
            $table->string('status')->default('pending'); // pending, confirmed, rescheduled, cancelled, completed
            $table->text('tenant_notes')->nullable();
            $table->text('agent_notes')->nullable();
            $table->timestamp('rescheduled_at')->nullable();
            $table->timestamps();

            $table->index(['property_id', 'inspection_date']);
            $table->index(['tenant_id', 'status']);
            $table->index(['agent_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_bookings');
    }
};
