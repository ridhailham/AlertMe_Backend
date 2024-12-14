const Kantor = require("../models/KantorModel.js");
const Laporan = require("../models/LaporanModel");
const User = require("../models/UserModel.js");
const { Op } = require("sequelize");

// Membuat laporan baru
exports.createLaporan = async (req, res) => {
    try {
        const { name, deskripsi, lokasi_kejadian, kantorUuid } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "File gambar harus diunggah" });
        }

        // Cari data kantor berdasarkan kantorUuid
        const kantor = await Kantor.findOne({
            where: { uuid: kantorUuid },
            attributes: ['alamat'] // Ambil hanya atribut alamat
        });

        if (!kantor) {
            return res.status(404).json({ message: "Kantor tidak ditemukan" });
        }

        
        

        // Gunakan alamat dari tabel Kantor untuk laporan
        const laporan = await Laporan.create({
            jenis_petugas: kantor.dataValues.alamat,
            name,
            deskripsi,
            alamat_kantor: kantor.alamat, // Gunakan alamat dari Kantor
            lokasi_kejadian,
            image: req.file.path, // Path ke file yang diunggah
            userUuid: req.user.uuid, // User UUID dari token
            kantorUuid, // UUID kantor terkait
            status: 'uncomplete', // Default status saat laporan dibuat
        });

        res.status(201).json({
            message: "Laporan berhasil dibuat",
            laporan,
        });
    } catch (error) {
        console.error("Error in createLaporan:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};



// Mendapatkan semua laporan
exports.getLaporan = async (req, res) => {
    try {
        const laporan = await Laporan.findAll({
            attributes: [
                'uuid',
                'jenis_petugas',
                'name',
                'deskripsi',
                'alamat_kantor',
                'lokasi_kejadian',
                'image',
                'status'
            ],
            include: [
                {
                    model: User,
                    as: 'user', // Alias untuk User
                    attributes: ['name', 'email'],
                },
                {
                    model: Kantor,
                    as: 'kantor', // Alias untuk Kantor
                    attributes: ['name', 'jenis_petugas', 'alamat_kantor'],
                },
            ],
        });

        res.status(200).json(laporan);
    } catch (error) {
        console.error("Error detail:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};



// Mendapatkan laporan berdasarkan ID
exports.getLaporanById = async (req, res) => {
    try {
        const laporan = await Laporan.findOne({
            attributes: [
                'uuid',
                'jenis_petugas',
                'name',
                'deskripsi',
                'alamat_kantor',
                'lokasi_kejadian',
                'image',
                'status'
            ],
            where: { uuid: req.params.id },
            include: [
                {
                    model: User,
                    as: 'user', // Alias untuk User
                    attributes: ['name', 'email'],
                },
                {
                    model: Kantor,
                    as: 'kantor', // Alias untuk Kantor
                    attributes: ['name', 'jenis_petugas', 'alamat_kantor'],
                },
            ],
        });

        if (!laporan) {
            return res.status(404).json({ message: "Laporan tidak ditemukan" });
        }

        res.status(200).json(laporan);
    } catch (error) {
        console.error("Error detail:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};




// Menghapus laporan berdasarkan ID
exports.deleteLaporan = async (req, res) => {
    try {
        const laporan = await Laporan.findOne({
            where: { uuid: req.params.id },
        });

        if (!laporan) {
            return res.status(404).json({ message: "Laporan tidak ditemukan" });
        }

        await Laporan.destroy({
            where: { uuid: laporan.uuid },
        });

        res.status(200).json({ message: "Laporan berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};




// Mengubah status menjadi uncomplete
exports.setStatusUncomplete = async (req, res) => {
    try {
        const laporan = await Laporan.findOne({ where: { uuid: req.params.id } });

        if (!laporan) {
            return res.status(404).json({ message: "Laporan tidak ditemukan" });
        }

        laporan.status = 'uncomplete';
        await laporan.save();

        res.status(200).json({ message: "Status laporan berhasil diubah menjadi uncomplete", laporan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

// Mengubah status menjadi complete
exports.setStatusComplete = async (req, res) => {
    try {
        const laporan = await Laporan.findOne({ where: { uuid: req.params.id } });

        if (!laporan) {
            return res.status(404).json({ message: "Laporan tidak ditemukan" });
        }

        laporan.status = 'complete';
        await laporan.save();

        res.status(200).json({ message: "Status laporan berhasil diubah menjadi complete", laporan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

// Mengubah status menjadi rejected
exports.setStatusRejected = async (req, res) => {
    try {
        const laporan = await Laporan.findOne({ where: { uuid: req.params.id } });

        if (!laporan) {
            return res.status(404).json({ message: "Laporan tidak ditemukan" });
        }

        laporan.status = 'rejected';
        await laporan.save();

        res.status(200).json({ message: "Status laporan berhasil diubah menjadi rejected", laporan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};
