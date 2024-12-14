const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const { getKantor, getBPBD, getPolisi, getPemadamKebakaran, getRumahSakit } = require("../controllers/Kantor");
const router = express.Router();


router.get('/kantor', getKantor)

router.get('/bpbd', getBPBD)
router.get('/polisi', getPolisi)
router.get('/pemadamkebakaran', getPemadamKebakaran)
router.get('/rumahsakit', getRumahSakit)

module.exports = router;