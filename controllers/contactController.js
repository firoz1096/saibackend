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


// Fetch contact info (for GET request)
const getContactInfo = async (req, res) => {
  try {
    const dbCheck = await pool.query("SELECT current_database()");
    console.log("🟢 Connected DB:", dbCheck.rows[0].current_database);

    const result = await pool.query("SELECT * FROM contact LIMIT 1");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
// Save contact enquiry and send email 5–6 second delay 
// const createContactEnquiry = async (req, res) => {
//   const { name, phone, email, message } = req.body;

//   if (!name || !phone || !email || !message) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     // Save to DB
//     await pool.query(
//       "INSERT INTO contact_enquiry (name, phone, email, message) VALUES ($1, $2, $3, $4)",
//       [name, phone, email, message]
//     );
//   } catch (err) {
//     console.error("DB Error:", err);
//     return res.status(500).json({ error: "Failed to save enquiry" });
//   }

//   // Start sending emails (but do NOT block response if they fail)
//   try {
//     // EMAIL TO ADMIN
//     await transporter.sendMail({
//       from: `"SAI Enterprises" <${process.env.EMAIL_USER}>`,
//       // to: process.env.EMAIL_USER,
//        to: "firoz.webdesigner@gmail.com", 
//        subject: `Contact Request from ${name}`,
//       html: `
//         <h2>New Contact Form Submission</h2>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Phone:</strong> ${phone}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Message:</strong><br/>${message}</p>
//       `,
//     });

//     // CONFIRMATION EMAIL TO USER
//     await transporter.sendMail({
//       from: `"SAI Enterprises" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "We received your enquiry",
//       html: `
//         <h2>Thank you for contacting SAI Enterprises!</h2>
//         <p>Dear <strong>${name}</strong>,</p>
//         <p>We have received your message and our team will get back to you soon.</p>
//         <p><strong>Your Message:</strong></p>
//         <blockquote>${message}</blockquote>
//         <br/>
//         <p>Regards,<br/>SAI Enterprises Team</p>
//       `,
//     });

//   } catch (emailError) {
//     console.error("Email Sending Failed:", emailError);
//     // No return → user should still get success response
//   }

//   res.status(201).json({
//     message: "Enquiry submitted successfully.",
//   });
// };

// Save contact enquiry and send email User gets an instant response (no 5–6 second delay).
// const createContactEnquiry = async (req, res) => {
//   const { name, phone, email, message } = req.body;

//   if (!name || !phone || !email || !message) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     // Save to DB
//     await pool.query(
//       "INSERT INTO contact_enquiry (name, phone, email, message) VALUES ($1, $2, $3, $4)",
//       [name, phone, email, message]
//     );
//   } catch (err) {
//     console.error("DB Error:", err);
//     return res.status(500).json({ error: "Failed to save enquiry" });
//   }

//   // Respond immediately
//   res.status(201).json({
//     message: "Enquiry submitted successfully.",
//   });

//   // Send emails asynchronously (non-blocking)
//   transporter.sendMail({
//     from: `"SAI Enterprises" <${process.env.EMAIL_USER}>`,
//     to: "firoz.webdesigner@gmail.com", 
//     subject: `Contact Request from ${name}`,
//     html: `
//       <h2>New Contact Form Submission</h2>
//       <p><strong>Name:</strong> ${name}</p>
//       <p><strong>Phone:</strong> ${phone}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Message:</strong><br/>${message}</p>
//     `,
//   }).catch(err => console.error("Admin email error:", err));

//   transporter.sendMail({
//     from: `"SAI Enterprises" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "We received your enquiry",
//     html: `
//       <h2>Thank you for contacting SAI Enterprises!</h2>
//       <p>Dear <strong>${name}</strong>,</p>
//       <p>We have received your message and our team will get back to you soon.</p>
//       <p><strong>Your Message:</strong></p>
//       <blockquote>${message}</blockquote>
//       <br/>
//       <p>Regards,<br/>SAI Enterprises Team</p>
//     `,
//   }).catch(err => console.error("User email error:", err));
// };

// Save contact enquiry and send email- Promise.allSettled() allows both emails to be sent concurrently
const createContactEnquiry = async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Save to DB
    await pool.query(
      "INSERT INTO contact_enquiry (name, phone, email, message) VALUES ($1, $2, $3, $4)",
      [name, phone, email, message]
    );
  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ error: "Failed to save enquiry" });
  }

  // Respond immediately
  res.status(201).json({
    message: "Enquiry submitted successfully.",
  });

  // Send emails concurrently (non-blocking)
  const adminEmail = transporter.sendMail({
    from: `"SAI Enterprises" <${process.env.EMAIL_USER}>`,
    to: "firoz.webdesigner@gmail.com",
    subject: `Contact Request from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  });

  const userEmail = transporter.sendMail({
    from: `"SAI Enterprises" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "We received your enquiry",
    html: `
      <h2>Thank you for contacting SAI Enterprises!</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>We have received your message and our team will get back to you soon.</p>
      <p><strong>Your Message:</strong></p>
      <blockquote>${message}</blockquote>
      <br/>
      <p>Regards,<br/>SAI Enterprises Team</p>
    `,
  });

  // Run both promises concurrently and log any errors
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



// Get all contact enquiries
const getContactEnquiries = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, phone, email, message, created_at FROM contact_enquiry ORDER BY id DESC"
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching enquiries:", err);
    res.status(500).json({ error: "Database error" });
  }
};



module.exports = { getContactInfo, createContactEnquiry, getContactEnquiries };
