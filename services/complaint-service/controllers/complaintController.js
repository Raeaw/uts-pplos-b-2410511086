const Complaint = require("../models/Complaint");

// 1. Endpoint Membuat Pengaduan Baru (POST)
exports.createComplaint = async (req, res) => {
	try {
		const { judul, deskripsi, kategori } = req.body;

		// Mengambil identitas user dari Header (disisipkan oleh API Gateway)
		const email = req.headers["x-user-email"];
		const name = req.headers["x-user-name"];

		if (!email) {
			return res
				.status(401)
				.json({
					message:
						"Unauthorized: Akses langsung ke service ditolak. Gunakan Gateway.",
				});
		}

		const newComplaint = new Complaint({
			judul,
			deskripsi,
			kategori,
			mahasiswa_email: email,
			mahasiswa_name: name,
		});

		await newComplaint.save();
		res
			.status(201)
			.json({ message: "Pengaduan berhasil dibuat", data: newComplaint });
	} catch (error) {
		res
			.status(400)
			.json({ message: "Gagal membuat pengaduan", error: error.message });
	}
};

// 2. Endpoint Mengambil Daftar Pengaduan dengan Paging & Filtering (GET)
exports.getComplaints = async (req, res) => {
	try {
		// Menerima parameter query (Syarat UTS)
		const page = parseInt(req.query.page) || 1;
		const per_page = parseInt(req.query.per_page) || 10;
		const kategori = req.query.kategori;

		// Menyusun query database
		let query = {};

		// Jika ada filter kategori (contoh: ?kategori=akademik)
		if (kategori) {
			query.kategori = kategori;
		}

		// Menghitung total data untuk keperluan pagination
		const total_data = await Complaint.countDocuments(query);

		// Jika data kosong berdasarkan filter, kembalikan 404 (Best Practice REST API)
		if (total_data === 0) {
			return res
				.status(404)
				.json({
					message: "Data pengaduan tidak ditemukan untuk kriteria tersebut.",
				});
		}

		// Mengambil data dengan batasan paging
		const complaints = await Complaint.find(query)
			.sort({ createdAt: -1 }) // Urutkan dari yang terbaru
			.skip((page - 1) * per_page)
			.limit(per_page);

		// Mengembalikan response sesuai format pagination
		res.status(200).json({
			message: "Berhasil mengambil data pengaduan",
			data: complaints,
			pagination: {
				current_page: page,
				per_page: per_page,
				total_data: total_data,
				total_pages: Math.ceil(total_data / per_page),
			},
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Terjadi kesalahan server", error: error.message });
	}
};
