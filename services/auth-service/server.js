require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Agar bisa menerima payload JSON

const authRoutes = require("./routes/authRoutes");

// Cek koneksi ke MongoDB
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log("Terhubung ke Database MongoDB (Auth Service)"))
	.catch((err) => console.error("Gagal terhubung ke MongoDB:", err.message));

// Rute tes dasar
app.get("/api/auth/health", (req, res) => {
	res.status(200).json({ status: "OK", message: "Auth Service is running" });
});

// Routes
app.use("/api/auth", authRoutes);

// Menjalankan server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Auth Service berjalan di http://localhost:${PORT}`);
});
