const jwt = require('jsonwebtoken');

const verifyJwt = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Gateway: Akses ditolak. Token tidak ditemukan.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Sisipkan data penting ke header agar service di belakang bisa membacanya
        req.headers['x-user-id'] = verified.id;
        req.headers['x-user-email'] = verified.email;
        req.headers['x-user-name'] = verified.name;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Gateway: Token tidak valid atau kedaluwarsa.' });
    }
};

module.exports = verifyJwt;