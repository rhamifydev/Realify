<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KycProfile extends Model
{
    protected $fillable = [
        'user_id', 'status', 'nin', 'bvn', 'id_type', 
        'id_document_path', 'selfie_path', 'cac_rc_number', 
        'esvarbon_license', 'lasrera_number'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
