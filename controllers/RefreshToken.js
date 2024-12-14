const Users = require("../models/UserModel.js")
const jwt = require("jsonwebtoken")

exports.refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401)

        const user = await Users.findOne({
            where: {
                refresh_token: refreshToken
            }
        })
        if(!user) return res.status(403)
        const userId  = user.uuid
        const name = user.name
        const email = user.email
        const role = user.role
        const accessToken = jwt.sign({userId, name, email, role}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '3h'
        })

        res.json({})

    } catch (error) {
        console.log(error);
    }
}