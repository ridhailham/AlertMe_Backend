const { Sequelize } = require("sequelize")
const db = require("../config/Database.js");
const Users = require("./UserModel.js")


const { DataTypes } = Sequelize;

const KTP = db.define('ktp',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        validate:{
            notEmpty: true
        }
    },
    image:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
        
    },
},{
    freezeTableName: true
});

Users.hasMany(KTP);
KTP.belongsTo(Users, {foreignKey: 'userUuid'});

module.exports = KTP;