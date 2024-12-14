const jwt = require('jsonwebtoken');
const User = require('../models/UserModel.js');
const {secret} = require('../config/auth.js')


exports.adminOnly = async (req, res, next) => {
    // const token = req.headers['authorization'];

    // if (!token) {
    //     return res.status(400).json({
    //         message: 'Silakan login ke akun Anda dahulu',
    //     });
    // }

    try {
        // const decoded = jwt.verify(token, secret); // Replace with your actual secret key
        const user = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.user.uuid,
            },
        });

        if (!user) {
            return res.status(400).json({
                message: 'User tidak ditemukan',
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Akses terlarang, Anda bukan admin',
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token tidak valid',
        });
    }
};
