const Complaint = require('../models/Complaint');

exports.getComplaints = async (req, res) => {
    try {
        const { kategori, page = 1, limit = 10 } = req.query;
        let query = {};

        // Filtering berdasarkan kategori
        if (kategori) {
            query.kategori = kategori;
        }

        const complaints = await Complaint.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        // Mengembalikan error status 404 jika query pada kategori tidak ada hasilnya
        if (!complaints || complaints.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data pengaduan tidak ditemukan untuk kategori tersebut.'
            });
        }

        const count = await Complaint.countDocuments(query);

        res.status(200).json({
            success: true,
            data: complaints,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};