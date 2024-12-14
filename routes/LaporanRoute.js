const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const {
    createLaporan,
    getLaporan,
    getLaporanById,
    deleteLaporan,
    setStatusUncomplete,
    setStatusComplete,
    setStatusRejected, // Sesuaikan dengan nama fungsi delete yang benar
} = require("../controllers/Laporan.js");

const { verifyToken } = require("../middleware/verifyToken.js");
const { adminOnly } = require("../middleware/AuthUser.js");

// Fungsi untuk mengenkripsi nama file
function encryptFileName(originalName) {
    const timestamp = Date.now(); // Tambahkan timestamp agar nama file unik
    const hash = crypto.createHash('sha256').update(originalName + timestamp).digest('hex');
    const ext = path.extname(originalName);
    return `${hash}${ext}`;
}

// Storage dengan multer
const storageFotoLaporan = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./assets/laporan"); // Folder tempat file akan disimpan
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
const uploadFotoLaporan = multer({
    storage: storageFotoLaporan,
    fileFilter: imageFilter
});

const router = express.Router();

// Middleware tambahan untuk menangani CORS jika diperlukan
router.use(function(req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'Authorization, Origin, Content-Type, Accept'
    );
    next();
});

// ==================== LAPORAN ROUTES ========================== //

// Route untuk membuat laporan dengan file foto
router.post('/laporan', verifyToken, uploadFotoLaporan.single('laporan'), createLaporan);

// Route untuk mendapatkan semua laporan
router.get('/laporan', verifyToken, getLaporan);

// Route untuk mendapatkan laporan berdasarkan ID
router.get('/laporan/:id', verifyToken, getLaporanById);

// Route untuk menghapus laporan berdasarkan ID
router.delete('/laporan/:id', verifyToken, deleteLaporan);

// Rute untuk mengubah status laporan
router.put('/laporan/status/uncomplete/:id', verifyToken, adminOnly, setStatusUncomplete);
router.put('/laporan/status/complete/:id', verifyToken, adminOnly, setStatusComplete);
router.put('/laporan/status/rejected/:id', verifyToken, adminOnly, setStatusRejected);

module.exports = router;
