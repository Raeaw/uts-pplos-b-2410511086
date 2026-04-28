require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi Database
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log("Terhubung ke MongoDB (Complaint Service)"))
	.catch((err) => console.error("Gagal terhubung ke MongoDB:", err));

// Routes
app.use('/api/v1/pengaduan', complaintRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
	console.log(`Complaint Service aktif di port ${PORT}`);
});
