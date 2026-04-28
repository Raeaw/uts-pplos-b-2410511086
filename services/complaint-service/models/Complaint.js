const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
	{
		judul: {
			type: String,
			required: [true, "Judul pengaduan wajib diisi"],
			minlength: [5, "Judul minimal 5 karakter"],
		},
		deskripsi: {
			type: String,
			required: [true, "Deskripsi wajib diisi"],
		},
		kategori: {
			type: String,
			enum: ["akademik", "non-akademik", "fasilitas", "keuangan"],
			required: [true, "Kategori wajib diisi"],
		},
		status: {
			type: String,
			enum: ["pending", "diproses", "selesai", "ditolak"],
			default: "pending",
		},
		// Data pelapor yang didapat dari Header API Gateway
		mahasiswa_email: {
			type: String,
			required: true,
		},
		mahasiswa_name: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Complaint", complaintSchema);
