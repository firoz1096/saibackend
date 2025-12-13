const express = require("express");
const router = express.Router();
const {
  getContactInfo,
  createContactEnquiry,
  getContactEnquiries,
} = require("../controllers/contactController");

// Get general contact info
router.get("/contact-info", getContactInfo);

// Save a new contact enquiry
router.post("/contact-enquiry", createContactEnquiry);

// Get all contact enquiries
router.get("/contact-enquiries", getContactEnquiries);

module.exports = router;
