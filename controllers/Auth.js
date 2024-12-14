
const User = require("../models/UserModel.js")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()


const { secret } = require("../config/auth.js");
const { refreshToken } = require("./RefreshToken.js")




exports.Login = async (req, res, next) => {

  const { body } = req;

  try {
      const user = await User.findOne({
          where: {
              email: body.email
          }
      });

      if (!user) {
          return res.status(403).json({
              message: 'User Not Found'
          });
      }

      if(user.role != "user") {
        return res.status(400).json({
          message: "bukan user"
        })
      }

      const passwordIsValid = bcrypt.compareSync(body.password, user.password);

      if (!passwordIsValid) {
          return res.status(400).json({
              accessToken: null,
              message: 'Invalid password'
          });
      }

      const data = {
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          // role: user.role
        };

      const token = jwt.sign( data,
          secret, // Secret key
          {
              expiresIn: '6h', // Token expiration time (adjust as needed)
          }
      );

      // res.cookie("token", token, {
      //   httpOnly: true
      // });

      // const refreshToken = jwt.sign({ userId }, config.secret, {
      //     expiresIn: '86400'
      // });

      // await User.update({ refresh_token: refreshToken }, {
      //     where: {
      //         uuid: userId
      //     }
      // });

      // res.cookie("refreshToken", refreshToken, {
      //     httpOnly: true,
      //     maxAge: 12,
      // });

      

      res.status(200).json({ 
        token: token,
        
        message: "login berhasil"
       });

      next();
      
  } catch (err) {
      console.error(err);
      res.status(500).json({
          message: "Internal Server Error"
      });
  }
}







exports.Me = async (req, res) => {
  
  try {
    if(!req.user) {
      return res.status(403).json({
          message: "silakan login ke akun anda dahulu"
      }) 

    } 
      const response = await User.findOne({
          attributes:['uuid','name','email','role'],
          where: {
              uuid: req.user.uuid
          }
      })
      res.status(200).json(response);
      
  } catch (error) {
      res.status(500).json({msg: error.message});
  }
    
}

    // if(!req.session.userId) {
    //     return res.status(400).json({
    //         message: "silakan login ke akun anda dahulu"
    //     })
    // }

    

exports.getUserById = async (req, res) =>{

  try {
      const response = await User.findOne({
          attributes:['uuid','name','email','role', 'ktp'],
          where: {
              uuid: req.params.id
          }
      })
      res.status(200).json(response);
      
  } catch (error) {
      res.status(500).json({msg: error.message});
  }
  
}   

exports.Logout = async (req, res) => {
  res.status(200).json({ message: "Logout berhasil" });
};

// exports.logOut = async(req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if(!refreshToken) return res.status(204).json({
//     message: "anda belum login dan token tidak ada sejak awal"
//   })

//   const user = await User.findOne({
//       where: {
//           refresh_token: refreshToken
//       }
//   })
//   if(!user) return res.status(204)

//   const userId = user.uuid
//   await User.update({refresh_token: null}, {
//     where: {
//       uuid: userId
//     }
//   })

//   res.clearCookie('refreshToken')
//   return res.status(200).json({
//     message: "berhasil logout"
//   })
// }


exports.Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  const role = "user";
  
  if (!name || !email || !password || !confPassword) {
      return res.status(400).json({ message: "Mohon diisi dengan lengkap" });
  }

  if (password !== confPassword) {
      return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
  }

  // Validasi email harus Gmail
  const isGmail = /@gmail\.com$/.test(email);
  if (!isGmail) {
      return res.status(400).json({ msg: "Email harus menggunakan Gmail" });
  }

  const isUserExist = await User.findOne({
      where: { email },
  });

  if (isUserExist) {
      return res.status(400).json({ message: "Email sudah digunakan" });
  }

  const hashPassword = await bcrypt.hash(password, 8);

  try {
      // Buat user baru
      const newUser = await User.create({
          name,
          email,
          password: hashPassword,
          role,
      });

      // Buat token JWT
      const data = {
          uuid: newUser.uuid,
          name: newUser.name,
          email: newUser.email,
      };

      const token = jwt.sign(data, process.env.JWT_SECRET || secret, {
          expiresIn: '6h', // Token berlaku selama 1 jam
      });

      // Kirimkan token ke respon
      res.status(201).json({
          message: "Register Berhasil",
          token
      });
  } catch (error) {
      res.status(400).json({ msg: error.message });
  }
};

exports.LoginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Cari user berdasarkan email
        const user = await User.findOne({
            where: { email },
        });

        // Jika user tidak ditemukan
        if (!user) {
            return res.status(404).json({
                message: "Admin tidak ditemukan",
            });
        }

        // Periksa apakah user adalah admin
        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Akses ditolak, Anda bukan admin",
            });
        }

        // Validasi password
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: "Password salah",
            });
        }

        // Buat token JWT
        const data = {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(data, process.env.JWT_SECRET || secret, {
            expiresIn: '6h', // Token berlaku selama 6 jam
        });

        // Kirimkan respon dengan token
        res.status(200).json({
            token,
            message: "Login admin berhasil",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Terjadi kesalahan pada server",
        });
    }
};
