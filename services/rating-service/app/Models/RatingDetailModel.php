<?php

namespace App\Models;

use CodeIgniter\Model;

class RatingDetailModel extends Model
{
    protected $table            = 'rating_details';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    
    protected $allowedFields    = [
        'id_rating_header', 
        'id_aspek', 
        'id_skala'
    ];
}