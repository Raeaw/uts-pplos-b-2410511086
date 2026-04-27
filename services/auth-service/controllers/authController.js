const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Logika Register (Pendaftaran)
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Cek apakah email sudah terdaftar
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // Hash password menggunakan bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Buat user baru
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            oauth_provider: 'local'
        });

        // Simpan ke database (Ini akan otomatis memicu pembuatan database db_auth_service!)
        await newUser.save();

        res.status(201).json({ message: 'Registrasi berhasil', user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

// Logika Login Lokal
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari user berdasarkan email
        const user = await User.findOne({ email });
        if (!user || user.oauth_provider !== 'local') {
            return res.status(401).json({ message: 'Email atau password salah / Gunakan login Google' });
        }

        // Cek kecocokan password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        // Jika cocok, buat Access Token (JWT valid 15 menit sesuai soal UTS)
        const accessToken = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Buat Refresh Token (valid 7 hari sesuai soal UTS)
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Simpan refresh token ke database (opsional tapi disarankan untuk fitur logout/blacklist)
        user.refresh_token = refreshToken;
        await user.save();

        res.status(200).json({
            message: 'Login berhasil',
            access_token: accessToken,
            refresh_token: refreshToken
        });

    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};