const express = require("express");
const cors = require("cors");
require("dotenv").config();

const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const contactRoutes = require("./routes/contactRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const servicesRoutes = require("./routes/servicesRoutes");
const getQuoteRoutes = require("./routes/getQuoteRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* ================== CORS (FIRST) ================== */
// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://saienter.netlify.app",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://saienter.netlify.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ================== MIDDLEWARE ================== */
app.use(express.json());
app.use(express.static("public"));

/* ================== ROUTES ================== */
app.use("/api", contactRoutes);
app.use("/api", aboutRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/get-quote", getQuoteRoutes);
app.use("/api/auth", authRoutes);

/* ================== MULTER ================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${uuidv4()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    if (allowed.test(file.mimetype) && allowed.test(file.originalname.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Only jpeg, jpg, png, and gif files are allowed"));
    }
  },
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    message: "File uploaded successfully",
    imagePath: `/uploads/${req.file.filename}`,
  });
});

app.post("/upload-multiple", upload.array("images", 10), (req, res) => {
  if (!req.files?.length) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  res.json({
    count: req.files.length,
    imagePaths: req.files.map(f => `/uploads/${f.filename}`),
  });
});

/* ================== HEALTH CHECK ================== */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* ================== ERROR HANDLER ================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: err.message });
});

/* ================== START SERVER ================== */


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

const PORT = process.env.PORT;
console.log("PORT FROM ENV =", process.env.PORT);
app.get("/", (req, res) => {
  res.status(200).send("OK");
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});


