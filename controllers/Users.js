const KTP = require("../models/KTPModel.js");
const User = require("../models/UserModel.js")
const bcrypt = require("bcryptjs")
const {Op} = require('sequelize')
const multer = require("multer");

exports.createKTP = async (req, res) =>{
    try {

        await KTP.create({
            image: req.file.path,
            userUuid: req.user.uuid
        })

        res.status(200).json({
            message: "ktp created successfully"
        })
    } catch (error) {
        console.log("error", error)
        res.status(500).json(error.message)
    }
    
}

exports.getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['uuid','name','email','role', 'ktp']
        });
        res.status(200).json(response);
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getUserById = async (req, res) =>{

    try {
        const response = await User.findOne({
            attributes:['uuid','name','email','role'],
            where: {
                uuid: req.params.id
            }
        })
        res.status(200).json(response);
        
    } catch (error) {
        res.status(500).json({msg: error.message});
    }


    
}


  
exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        const { oldPassword, newPassword, confPassword } = req.body;

        // Periksa apakah oldPassword sesuai dengan password di database
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isOldPasswordValid) {
            return res.status(400).json({ msg: "Password lama salah" });
        }

        // Validasi kecocokan newPassword dan confPassword
        if (newPassword !== confPassword) {
            return res.status(400).json({ msg: "Password baru dan konfirmasi password tidak cocok" });
        }

        // Hash password baru
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await User.update({ password: hashedPassword }, { where: { uuid: user.uuid } });

        res.status(200).json({ msg: "Password berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


exports.updateName = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        const { name } = req.body;

        if (!name || name.trim().length < 3) {
            return res.status(400).json({ msg: "Nama tidak valid. Minimal 3 karakter" });
        }

        // Update nama
        await User.update({ name }, { where: { uuid: user.uuid } });

        res.status(200).json({ msg: "Nama berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};



exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        await user.destroy();
        res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
