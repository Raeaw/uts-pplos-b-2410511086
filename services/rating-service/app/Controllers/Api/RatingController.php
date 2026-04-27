<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\RatingModel;

class RatingController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new RatingModel();
        
        // Menangkap parameter query untuk filtering
        $aspekId = $this->request->getGet('aspek_id');
        
        if ($aspekId) {
            $model->where('aspek_penilaian_id', $aspekId);
        }

        // Paging
        $page = $this->request->getGet('page') ?? 1;
        $data = $model->paginate(10, 'default', $page);

        // Mengembalikan error status 404 jika hasil query kosong
        if (empty($data)) {
            return $this->failNotFound('Data rating tidak ditemukan untuk parameter yang diberikan.');
        }

        return $this->respond([
            'status' => 200,
            'data' => $data,
            'pagination' => $model->pager->getDetails()
        ], 200);
    }
}