const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/Database.js");
const UserRoute = require("./routes/UserRoute.js");
const KantorRoute = require("./routes/KantorRoute.js");
const LaporanRoute = require("./routes/LaporanRoute.js")
// const BeritaRoute = require("./routes/BeritaRoute.js");
const AuthRoute = require("./routes/AuthRoute.js");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

// Import Models
const User = require('./models/UserModel.js');
const KTP = require('./models/KTPModel.js');
const Laporan = require('./models/LaporanModel.js');
const Kantor = require('./models/KantorModel.js');

dotenv.config();

const app = express();

app.use('/assets', express.static('assets'));


// Fungsi untuk menambahkan data awal
// Fungsi untuk menambahkan data awal
async function initial() {
    try {
        // Data awal untuk tabel User (Admin)
        const adminUser = await User.create({
            uuid: "2fda81ca-56b9-49a9-963e-a55af7c92cea",
            name: "master admin",
            email: "admin@gmail.com",
            password: bcrypt.hashSync('admin', 8),
            role: 'admin',
        });

        // Data awal untuk tabel KTP (Admin)
        await KTP.create({
            userUuid: adminUser.uuid, // Relasi dengan User
            image: "assets/ktp/admin-ktp-image.jpg",
        });

        // Data awal untuk tabel User (Regular User)
        const regularUser = await User.create({
            uuid: "1fda81ca-56b9-49a9-963e-a55af7c92ced",
            name: "John Doe",
            email: "johndoe@gmail.com",
            password: bcrypt.hashSync('userpassword', 8),
            role: 'user',
        });

        // Data awal untuk tabel KTP (Regular User)
        await KTP.create({
            userUuid: regularUser.uuid, // Relasi dengan user biasa
            image: "assets/ktp/johndoe-ktp-image.jpg",
        });

        // Data awal untuk tabel Kantor
        const kantorData = [
            // Rumah Sakit
            { jenis_petugas: "rumah sakit", name: "RSUD Saiful Anwar", alamat: "Jl. Jaksa Agung Suprapto No.2, Klojen, Kec. Klojen, Kota Malang, Jawa Timur 65112", telfon: "0341999991" },
            { jenis_petugas: "rumah sakit", name: "Rumah Sakit Lavalette", alamat: "Jl. W.R. Supratman No.10, Rampal Celaket, Kec. Klojen, Kota Malang, Jawa Timur 65111", telfon: "0341999992" },
            { jenis_petugas: "rumah sakit", name: "Rumah Sakit Universitas Brawijaya", alamat: "Jl. Soekarno - Hatta, Lowokwaru, Kec. Lowokwaru, Kota Malang, Jawa Timur 65141", telfon: "0341999993" },
            { jenis_petugas: "rumah sakit", name: "RSI UNISMA", alamat: "Jl. Mayjen Haryono No.139, Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144", telfon: "0341999994" },
            { jenis_petugas: "rumah sakit", name: "RSU BRIMEDIKA MALANG", alamat: "Jl. Mayjend Panjaitan No.176, Penanggungan, Kec. Klojen, Kota Malang, Jawa Timur 65113", telfon: "0341999995" },

            // Pemadam Kebakaran
            { jenis_petugas: "pemadam kebakaran", name: "Pemadam Kebakaran Kota Malang", alamat: "Jl. Bingkil No.1, Ciptomulyo, Kec. Sukun, Kota Malang, Jawa Timur 65148", telfon: "0341999996" },
            { jenis_petugas: "pemadam kebakaran", name: "Dinas Pemadam Kebakaran Kota Malang", alamat: "Jl. Raden Intan No.5, Arjosari, Kec. Blimbing, Kota Malang, Jawa Timur 65126", telfon: "0341999997" },
            { jenis_petugas: "pemadam kebakaran", name: "Mako Pemadam Kebakaran Kabupaten Malang", alamat: "Gang 13 Jl. MT. Haryono No.413, Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144", telfon: "0341999998" },

            // Polisi
            { jenis_petugas: "polisi", name: "Kantor POLRES Malang", alamat: "Jl. Jaksa Agung Suprapto No.19, Samaan, Kec. Klojen, Kota Malang, Jawa Timur 65112", telfon: "0341999999" },
            { jenis_petugas: "polisi", name: "POLSEKTA Blimbing", alamat: "Jl. Raden Intan No.5, Arjosari, Kec. Blimbing, Kota Malang, Jawa Timur 65126", telfon: "0341999910" },
            { jenis_petugas: "polisi", name: "Kantor Polsek Lowokwaru", alamat: "Gang 13 Jl. MT. Haryono No.413, Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144", telfon: "0341999911" },
            { jenis_petugas: "polisi", name: "Polsek Kedungkandang", alamat: "Jl. Ki Ageng Gribig No.96, Kedungkandang, Kec. Kedungkandang, Kota Malang, Jawa Timur 65136", telfon: "0341999912" },
            { jenis_petugas: "polisi", name: "POLRESTA Malang Kota", alamat: "Jl. Jaksa Agung Suprapto No.19, Samaan, Kec. Klojen, Kota Malang, Jawa Timur 65112", telfon: "0341999913" },

            // BPBD
            { jenis_petugas: "bpbd", name: "BPBD Kota Malang", alamat: "Jl. Mayjen Sungkono No.63, Buring, Kec. Kedungkandang, Kota Malang, Jawa Timur 65136", telfon: "0341999914" },
            { jenis_petugas: "bpbd", name: "BPBD Kabupaten Malang", alamat: "Ngadiluwih, Kedungpedaringan, Kec. Kepanjen, Kabupaten Malang, Jawa Timur 65163", telfon: "0341999915" },
            { jenis_petugas: "bpbd", name: "BPBD Kabupaten Blitar", alamat: "Jl. Bromo No.3, Gurit, Babadan, Kec. Wlingi, Kabupaten Blitar, Jawa Timur 66184", telfon: "0341999916" },
            { jenis_petugas: "bpbd", name: "BPBD Kota Batu", alamat: "Balai Kota Amongtani, Jl. Panglima Sudirman No.507, Pesanggrahan, Kec. Batu, Kota Batu, Jawa Timur 65313", telfon: "0341999917" },
            { jenis_petugas: "bpbd", name: "BPBD Kota Kediri", alamat: "Jl. Brigjend Pol. IBH Pranoto No.113, Bangsal, Kec. Pesantren, Kota Kediri, Jawa Timur 64131", telfon: "0341999918" }
        ];

        for (const kantor of kantorData) {
            await Kantor.create(kantor);
        }


        // Data awal untuk tabel Laporan
        // const laporanData = [
        //     {
        //         userUuid: regularUser.uuid, // Relasi dengan User
        //         kantorUuid: kantorData[0].uuid, // Relasi dengan Kantor
        //         jenis_petugas: "rumah sakit",
        //         name: "Laporan Kebakaran Rumah",
        //         deskripsi: "Ada kebakaran rumah di wilayah X.",
        //         alamat_kantor: kantorData[0].alamat,
        //         lokasi_kejadian: "https://maps.google.com/?q=-7.797068,110.370529",
        //         image: "assets/laporan/laporan-image1.jpg",
        //         status: "uncomplete",
        //     },
        //     {
        //         userUuid: regularUser.uuid, // Relasi dengan User
        //         kantorUuid: kantorData[1].uuid, // Relasi dengan Kantor
        //         jenis_petugas: "pemadam kebakaran",
        //         name: "Laporan Kebakaran Gedung",
        //         deskripsi: "Ada kebakaran gedung di wilayah Y.",
        //         alamat_kantor: kantorData[0].alamat,
        //         lokasi_kejadian: "https://maps.google.com/?q=-7.800000,110.370000",
        //         image: "assets/laporan/laporan-image2.jpg",
        //         status: "complete",
        //     },
        //     {
        //         userUuid: regularUser.uuid, // Relasi dengan User
        //         kantorUuid: kantorData[2].uuid, // Relasi dengan Kantor
        //         jenis_petugas: "polisi",
        //         name: "Laporan Pencurian",
        //         deskripsi: "Ada pencurian di wilayah Z.",
        //         alamat_kantor: kantorData[0].alamat,
        //         lokasi_kejadian: "https://maps.google.com/?q=-7.805000,110.375000",
        //         image: "assets/laporan/laporan-image3.jpg",
        //         status: "rejected",
        //     },
        // ];

        // Tambahkan data laporan
        // for (const laporan of laporanData) {
        //     await Laporan.create(laporan);
        // }

        console.log("Initial data added successfully.");
    } catch (error) {
        console.error("Failed to add initial data:", error);
    }
}



// Sinkronisasi database
db.sync()
    .then(() => {
        console.log("Database connected and tables created.");
        // initial(); // Panggil fungsi untuk menambahkan data awal
    })
    .catch((err) => {
        console.error("Database failed to connect:", err);
    });

app.use(cookieParser());
app.use(express.json());
app.use(UserRoute);
app.use(KantorRoute);
app.use(LaporanRoute);

app.use(AuthRoute);

const APP_PORT = process.env.APP_PORT || 4000;

app.listen(APP_PORT, () => {
    console.log(`SERVER IS RUNNING on port ${APP_PORT}`);
});
