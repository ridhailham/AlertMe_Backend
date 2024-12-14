    const express = require("express")
    const { 
        Login, 
        Me, 
        Register,
        
        LoginAdmin,
        Logout
     } = require("../controllers/Auth.js")

    const { verifyToken } = require('../middleware/verifyToken.js');
const { adminOnly } = require("../middleware/AuthUser.js");


    const router = express.Router();

    router.use(function(req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'Authorization, Origin, Content-Type, Accept'
        )
        next()

    })



    router.post('/register', Register)

    router.get('/me', verifyToken ,Me)
    router.post('/login', Login)
    router.delete('/logout', Logout)



    // PAGE ADMIN LOGIN
    router.post("/admin/login", LoginAdmin);


    module.exports = router;