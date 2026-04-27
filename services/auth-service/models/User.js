const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        // Password tidak wajib jika user login menggunakan Google OAuth
        required: function() { return this.oauth_provider === 'local'; } 
    },
    photo: { 
        type: String, 
        default: 'https://via.placeholder.com/150' // Foto profil default
    },
    oauth_provider: { 
        type: String, 
        enum: ['local', 'google'], 
        default: 'local' 
    },
    refresh_token: { 
        type: String, 
        default: null // Untuk menyimpan refresh token agar bisa di-revoke (logout)
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);