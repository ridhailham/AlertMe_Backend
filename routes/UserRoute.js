const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    cancelValidationUser,
    validationUser,
    createKTP,
    updatePassword,
    updateName,
} = require("../controllers/Users.js");

const { adminOnly } = require('../middleware/AuthUser.js');


const router = express.Router();


const { verifyToken } = require("../middleware/verifyToken.js");


// Fungsi untuk mengenkripsi nama file
function encryptFileName(originalName) {
    const timestamp = Date.now(); // Tambahkan timestamp agar nama file unik
    const hash = crypto.createHash('sha256').update(originalName + timestamp).digest('hex');
    const ext = path.extname(originalName);
    return `${hash}${ext}`;
}

// Storage dengan multer
const storageKTP = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./assets/ktp"); // Folder tempat file akan disimpan
    },
    filename: function (req, file, cb) {
        const encryptedName = encryptFileName(file.originalname);
        cb(null, encryptedName); // Simpan file langsung dengan nama terenkripsi
    }
});

// Filter untuk file gambar
const imageFilter = function (req, file, cb) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('File format not supported'));
    }
};

// Multer untuk upload file
const uploadktp = multer({
    storage: storageKTP,
    fileFilter: imageFilter
});

router.use(function(req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'Authorization, Origin, Content-Type, Accept'
    );
    next();
});

// ==================== USER ========================== //

// Route untuk upload KTP
router.post('/user/ktp', verifyToken, uploadktp.single('ktp'), createKTP);

router.get('/users/:id', verifyToken, getUserById);
router.put('/users/:id',  verifyToken, updatePassword)
router.put('/users/:id', verifyToken, updateName)



module.exports = router;
