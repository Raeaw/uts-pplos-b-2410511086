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

    public function index()
    {
        $headerModel = new \App\Models\RatingHeaderModel();
        $detailModel = new \App\Models\RatingDetailModel();

        $page = $this->request->getVar('page') ?? 1;
        $perPage = $this->request->getVar('per_page') ?? 10;
        $idPengaduan = $this->request->getVar('id_pengaduan'); // Filter opsional

        if ($idPengaduan) {
            $headerModel->where('id_pengaduan', $idPengaduan);
        }

        $headers = $headerModel->orderBy('created_at', 'DESC')->paginate($perPage, 'default', $page);
        
        $pager = $headerModel->pager;

        foreach ($headers as &$header) {
            $header['details'] = $detailModel->select('rating_details.id_aspek, aspek_penilaian.nama_aspek, rating_details.id_skala, skala_rating.keterangan')
                ->join('aspek_penilaian', 'aspek_penilaian.id = rating_details.id_aspek')
                ->join('skala_rating', 'skala_rating.id = rating_details.id_skala')
                ->where('id_rating_header', $header['id'])
                ->findAll();
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Berhasil mengambil daftar rating',
            'data'    => $headers,
            'pagination' => [
                'current_page' => (int)$page,
                'per_page'     => (int)$perPage,
                'total_data'   => $pager->getTotal(),
                'total_pages'  => $pager->getPageCount()
            ]
        ]);
    }

    public function update($id = null)
    {
        $headerModel = new RatingHeaderModel();
        $detailModel = new RatingDetailModel();

        // 1. Ambil email user dari Header API Gateway
        $userEmail = $this->request->getServer('HTTP_X_USER_EMAIL');
        if (!$userEmail) {
            return $this->failUnauthorized('Akses ditolak. Silakan lewat API Gateway.');
        }

        // 2. Cek apakah data rating header ada di database
        $existingRating = $headerModel->find($id);
        if (!$existingRating) {
            return $this->failNotFound('Data penilaian tidak ditemukan.');
        }

        // 3. Otorisasi Keamanan: Pastikan yang mengubah adalah pemilik data
        if ($existingRating['user_email'] !== $userEmail) {
            return $this->failForbidden('Anda tidak memiliki hak untuk mengubah data penilaian ini.');
        }

        // 4. Ambil data dari JSON Body
        $json = $this->request->getJSON();

        // 5. Mulai Database Transaction
        $db = \Config\Database::connect();
        $db->transStart();

        // 6. Update Tabel Header
        $headerData = [
            'komentar_tambahan' => $json->komentar_tambahan ?? $existingRating['komentar_tambahan'],
        ];
        $headerModel->update($id, $headerData);

        // 7. Update Tabel Detail (Hapus yang lama, masukkan yang baru)
        if (isset($json->ratings) && is_array($json->ratings)) {
            // Hapus detail lama berdasarkan id_rating_header
            $detailModel->where('id_rating_header', $id)->delete();
            
            // Masukkan detail baru
            foreach ($json->ratings as $item) {
                $detailModel->insert([
                    'id_rating_header' => $id,
                    'id_aspek'         => $item->id_aspek,
                    'id_skala'         => $item->id_skala,
                ]);
            }
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Gagal memperbarui penilaian.');
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Penilaian berhasil diperbarui',
            'data'    => ['id_rating' => $id]
        ]);
    }

    public function delete($id = null)
    {
        $headerModel = new RatingHeaderModel();
        $detailModel = new RatingDetailModel();

        // 1. Ambil email user dari Header API Gateway
        $userEmail = $this->request->getServer('HTTP_X_USER_EMAIL');
        if (!$userEmail) {
            return $this->failUnauthorized('Akses ditolak. Silakan lewat API Gateway.');
        }

        // 2. Cek apakah data rating header ada
        $existingRating = $headerModel->find($id);
        if (!$existingRating) {
            return $this->failNotFound('Data penilaian tidak ditemukan.');
        }

        // 3. Otorisasi Keamanan: Pastikan yang menghapus adalah pemilik data
        if ($existingRating['user_email'] !== $userEmail) {
            return $this->failForbidden('Anda tidak memiliki hak untuk menghapus data penilaian ini.');
        }

        // 4. Mulai Database Transaction
        $db = \Config\Database::connect();
        $db->transStart();

        // 5. Hapus Tabel Detail Terlebih Dahulu (Wajib agar tidak kena FK Constraint)
        $detailModel->where('id_rating_header', $id)->delete();
        
        // 6. Baru Hapus Tabel Header
        $headerModel->delete($id);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Gagal menghapus penilaian.');
        }

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Penilaian berhasil dihapus',
            'data'    => ['id_rating' => $id]
        ]);
    }
}