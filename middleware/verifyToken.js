const jwt = require('jsonwebtoken');
const config = require('../config/auth.js'); // Pastikan Anda mengimpor konfigurasi yang benar
const {secret} = require('../config/auth.js')
const User = require('../models/UserModel.js')



exports.verifyToken = async (req, res, next) => {
    // const token = req.headers['authorization'];
    const token = req.headers['authorization'];

 
  
    if (!token) {
      return res.status(403).json({
        message: 'Silakan login terlebih dahulu'
      });
    }
  
    // const JWTToken = token.split(' ').pop();
    // console.log(JWTToken);
    try {
      const data = jwt.verify(token, secret);
  
      const user = await User.findOne({ where: { uuid: data.uuid } });
  
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
  
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({
        message: 'Kredensial salah'
      });
    }
  };



