const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const User = require("./UserModel.js");
const Kantor = require("./KantorModel.js");

const { DataTypes } = Sequelize;

const Laporan = db.define('laporan', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true
        }
    },
    jenis_petugas: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    deskripsi: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    lokasi_kejadian: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isUrl: true // Validasi URL
        }
    },
    alamat_kantor: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'uncomplete', // Nilai default saat laporan dibuat
        validate: {
            notEmpty: true,
            isIn: [['complete', 'uncomplete', 'rejected']] // Hanya menerima nilai tertentu
        }
    }
}, {
    freezeTableName: true
});

Laporan.belongsTo(User, { foreignKey: 'userUuid', as: 'user' });
Laporan.belongsTo(Kantor, { foreignKey: 'kantorUuid', as: 'kantor' });

User.hasMany(Laporan, { foreignKey: 'userUuid', as: 'laporan' });
Kantor.hasMany(Laporan, { foreignKey: 'kantorUuid', as: 'laporanKantor' });

module.exports = Laporan;
