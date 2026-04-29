<?php

namespace App\Controllers;

use App\Models\RatingHeaderModel;
use App\Models\RatingDetailModel;
use CodeIgniter\RESTful\ResourceController;

class RatingController extends ResourceController
{
    protected $format = 'json';

    public function create()
    {
        $headerModel = new RatingHeaderModel();
        $detailModel = new RatingDetailModel();

        // 1. Ambil data dari JSON Body
        $json = $this->request->getJSON();

        // 2. Ambil email user dari Header (disisipkan oleh API Gateway)
        $userEmail = $this->request->getServer('HTTP_X_USER_EMAIL');

        if (!$userEmail) {
            return $this->failUnauthorized('Akses ditolak. Silakan lewat API Gateway.');
        }

        // 3. Mulai Database Transaction (agar jika satu gagal, semua batal)
        $db = \Config\Database::connect();
        $db->transStart();

        // 4. Simpan ke Tabel Header
        $headerData = [
            'id_pengaduan'      => $json->id_pengaduan,
            'user_email'        => $userEmail,
            'komentar_tambahan' => $json->komentar_tambahan ?? null,
        ];

        $headerModel->insert($headerData);
        $headerId = $headerModel->getInsertID();

        // 5. Simpan ke Tabel Detail (Array of Ratings)
        // Kita asumsikan input 'ratings' berupa array: [{"id_aspek": 1, "id_skala": 5}, ...]
        foreach ($json->ratings as $item) {
            $detailModel->insert([
                'id_rating_header' => $headerId,
                'id_aspek'         => $item->id_aspek,
                'id_skala'         => $item->id_skala,
            ]);
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Gagal menyimpan penilaian.');
        }

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Penilaian berhasil disimpan',
            'data'    => ['id_rating' => $headerId]
        ]);
    }
}