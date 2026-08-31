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
        Schema::create('kyc_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('draft');
            $table->string('nin')->nullable();
            $table->string('bvn')->nullable();
            $table->string('id_type')->nullable();
            $table->string('id_document_path')->nullable();
            $table->string('selfie_path')->nullable();
            $table->string('cac_rc_number')->nullable();
            $table->string('esvarbon_license')->nullable();
            $table->string('lasrera_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kyc_profiles');
    }
};
