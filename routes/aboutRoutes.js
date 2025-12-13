const express = require("express");
const router = express.Router();
const { getAboutInfo, updateAboutInfo } = require("../controllers/aboutController");

// GET About info
router.get("/about-info", getAboutInfo);

// PUT About info (update single row)
router.put("/about-info", updateAboutInfo);

module.exports = router;
