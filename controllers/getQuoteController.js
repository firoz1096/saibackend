const pool = require("../db/db");
const nodemailer = require("nodemailer"); //to send email

// Configure Nodemailer with Yahoo
const transporter = nodemailer.createTransport({
  service: "yahoo",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Save Quote and Send Email
const saveQuote = async (req, res) => {
  const { name, email, phone, message, service } = req.body;

  if (!name || !email || !phone || !service) {
    return res.status(400).json({ error: "Required fields missing!" });
  }

  let savedQuote;
  try {
    // 1️⃣ Save to database
    const result = await pool.query(
      `INSERT INTO get_quote (name, email, phone, message, service)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, phone, message, service]
    );

    savedQuote = result.rows[0];
  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ error: "Failed to save quote" });
  }

  // 2️⃣ Respond immediately
  res.status(201).json({ success: true, data: savedQuote, message: "Quote saved successfully!" });

  // 3️⃣ Send emails concurrently (non-blocking)
  const adminEmail = transporter.sendMail({
    from: `"SAI Enterprises" <${process.env.EMAIL_USER}>`,
    to: "firoz.webdesigner@gmail.com",
    subject: `Quote Request from ${name}`,
    html: `
      <h3>Hi, You have received a 'Quote Request' from SAI ENTERPRISES website.</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  });

  const userEmail = transporter.sendMail({
    from: `"Website Quote" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "We received your quote request",
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for submitting a quote request. We will contact you shortly.</p>
      <p><strong>Your Request:</strong></p>
      <p>Service: ${service}</p>
      <p>Message: ${message}</p>
      <br>
      <p>Best Regards,<br>Saienterprises</p>
    `,
  });

  Promise.allSettled([adminEmail, userEmail])
    .then(results => {
      results.forEach((result, idx) => {
        if (result.status === "rejected") {
          console.error(
            idx === 0 ? "Admin email error:" : "User email error:",
            result.reason
          );
        }
      });
    });
};



// Get All Quotes
const getAllQuotes = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM get_quote ORDER BY id DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching quotes:", err);
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
};

module.exports = { saveQuote, getAllQuotes };
