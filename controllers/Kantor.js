const Kantor = require("../models/KantorModel");

// Mendapatkan semua kantor
exports.getKantor = async (req, res) => {
    try {
        const response = await Kantor.findAll({
            attributes: ['uuid', 'jenis_petugas', 'name', 'alamat', 'telfon']
        });

        if (response.length === 0) {
            return res.status(404).json({ message: "Tidak ada data kantor yang ditemukan" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getKantor:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

// Mendapatkan kantor BPBD
exports.getBPBD = async (req, res) => {
    try {
        const response = await Kantor.findAll({
            where: { jenis_petugas: "bpbd" },
            attributes: ['uuid', 'jenis_petugas', 'name', 'alamat', 'telfon']
        });

        if (response.length === 0) {
            return res.status(404).json({ message: "Tidak ada data BPBD yang ditemukan" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getBPBD:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

// Mendapatkan kantor Polisi
exports.getPolisi = async (req, res) => {
    try {
        const response = await Kantor.findAll({
            where: { jenis_petugas: "polisi" },
            attributes: ['uuid', 'jenis_petugas', 'name', 'alamat', 'telfon']
        });

        if (response.length === 0) {
            return res.status(404).json({ message: "Tidak ada data Polisi yang ditemukan" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getPolisi:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

// Mendapatkan kantor Pemadam Kebakaran
exports.getPemadamKebakaran = async (req, res) => {
    try {
        const response = await Kantor.findAll({
            where: { jenis_petugas: "pemadam kebakaran" },
            attributes: ['uuid', 'jenis_petugas', 'name', 'alamat', 'telfon']
        });

        if (response.length === 0) {
            return res.status(404).json({ message: "Tidak ada data Pemadam Kebakaran yang ditemukan" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getPemadamKebakaran:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

// Mendapatkan kantor Rumah Sakit
exports.getRumahSakit = async (req, res) => {
    try {
        const response = await Kantor.findAll({
            where: { jenis_petugas: "rumah sakit" },
            attributes: ['uuid', 'jenis_petugas', 'name', 'alamat', 'telfon']
        });

        if (response.length === 0) {
            return res.status(404).json({ message: "Tidak ada data Rumah Sakit yang ditemukan" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getRumahSakit:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};
