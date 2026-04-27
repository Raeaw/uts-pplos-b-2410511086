<?php

namespace App\Models;

use CodeIgniter\Model;

class RatingModel extends Model
{
    // Konfigurasi Tabel
    protected $table            = 'rating';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    // Field yang diizinkan untuk diisi (Mass Assignment)
    protected $allowedFields    = [
        'pengaduan_id',         // ID referensi dari complaint-service (Node.js)
        'aspek_penilaian_id',   // FK ke tabel aspek_penilaian (digunakan pada filter query API)
        'periode_evaluasi_id',  // FK ke tabel periode_evaluasi
        'skor',                 // Nilai rating (misal 1-5)
        'komentar'              // Catatan evaluasi/kepuasan dari mahasiswa
    ];

    // Konfigurasi Timestamps otomatis
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Aturan Validasi Bawaan Model (Opsional, sangat membantu API layer)
    protected $validationRules      = [
        'pengaduan_id'       => 'required',
        'aspek_penilaian_id' => 'required|is_natural_no_zero',
        'skor'               => 'required|integer|greater_than_equal_to[1]|less_than_equal_to[5]'
    ];
    
    // Pesan Error Custom untuk Validasi
    protected $validationMessages   = [
        'skor' => [
            'greater_than_equal_to' => 'Skor rating minimal adalah 1.',
            'less_than_equal_to'    => 'Skor rating maksimal adalah 5.'
        ],
        'aspek_penilaian_id' => [
            'is_natural_no_zero'    => 'ID Aspek Penilaian tidak valid.'
        ]
    ];
    
    protected $skipValidation       = false;
}