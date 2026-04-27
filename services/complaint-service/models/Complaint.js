const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    judul: { type: String, required: true },
    deskripsi: { type: String, required: true },
    kategori: { type: String, required: true },
    status: { type: String, default: 'pending' },
    mahasiswa_email: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);