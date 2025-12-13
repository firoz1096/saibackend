
const express = require("express");
const router = express.Router();

const { saveQuote, getAllQuotes } = require("../controllers/getQuoteController");



router.post("/", saveQuote);     // POST - save quote
router.get("/", getAllQuotes);   // GET - all quotes

module.exports = router;
