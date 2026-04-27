require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const verifyJwt = require('./middleware/verifyJwt');

const app = express();
app.use(cors());

// 1. Basic Rate Limiting (Sesuai syarat UTS: 60 req/menit per IP)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 menit
    max: 60, 
    message: { message: 'Gateway: Terlalu banyak request dari IP ini, coba lagi nanti.' }
});
app.use(limiter);

// --- 2. ROUTING UNTUK AUTH SERVICE (Tanpa Proteksi JWT) ---
app.use('/api/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    // Mengembalikan awalan '/api/auth' yang dipotong oleh Express
    pathRewrite: (path, req) => '/api/auth' + req.url 
}));

// --- 3. ROUTING TERPROTEKSI (Wajib Lewat verifyJwt) ---
// Complaint Service (Pengaduan)
app.use('/api/v1/pengaduan', verifyJwt, createProxyMiddleware({
    target: process.env.COMPLAINT_SERVICE_URL,
    changeOrigin: true,
    // Mengembalikan awalan '/api/v1/pengaduan'
    pathRewrite: (path, req) => '/api/v1/pengaduan' + req.url 
}));

// Rating Service (Evaluasi/Feedback)
app.use('/api/v1/rating', verifyJwt, createProxyMiddleware({
    target: process.env.RATING_SERVICE_URL,
    changeOrigin: true,
    // Mengembalikan awalan '/api/v1/rating'
    pathRewrite: (path, req) => '/api/v1/rating' + req.url 
}));

// Endpoint status gateway
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Gateway Berjalan Normal' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway aktif di http://localhost:${PORT}`);
    console.log(`Auth Route      -> ${process.env.AUTH_SERVICE_URL}`);
    console.log(`Complaint Route -> ${process.env.COMPLAINT_SERVICE_URL}`);
    console.log(`Rating Route    -> ${process.env.RATING_SERVICE_URL}`);
});