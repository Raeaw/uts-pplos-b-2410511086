<?php

namespace App\Models;

use CodeIgniter\Model;

class RatingHeaderModel extends Model
{
    protected $table            = 'rating_headers';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    
    // Kolom-kolom yang diizinkan untuk diisi data (insert/update)
    protected $allowedFields    = [
        'id_pengaduan', 
        'user_email', 
        'komentar_tambahan'
    ];
}