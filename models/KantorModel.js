const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const { DataTypes } = Sequelize;

const Kantor = db.define(
    "kantor",
    {
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: true,
            },
        },
        jenis_petugas: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "jenis_petugas", // Explicitly define the database column name
            validate: {
                notEmpty: true,
                len: [2, 100],
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100],
            },
        },
        alamat: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        telfon: {
            type: DataTypes.STRING, // Nomor telepon dalam format string
            allowNull: true, // Opsional (diizinkan null)
            validate: {
                len: [7, 15], // Panjang minimal 7 digit, maksimal 15 digit
            },
        },
    },
    {
        freezeTableName: true,
    }
);

module.exports = Kantor;
