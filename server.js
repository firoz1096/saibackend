const express = require("express");
const cors = require("cors");
require("dotenv").config();

//multer, upload images with adding uuid
const multer = require("multer");
const { v4: uuidv4 } = require("uuid"); 


const contactRoutes = require("./routes/contactRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const servicesRoutes = require("./routes/servicesRoutes");
const getQuoteRoutes = require("./routes/getQuoteRoutes");
const authRoutes = require('./routes/authRoutes');


// Initialize app
const app = express();
// Middleware
app.use(cors());
// to parse JSON
app.use(express.json());


app.use("/api", contactRoutes);
app.use("/api", aboutRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/get-quote", getQuoteRoutes);
app.use('/api/auth', authRoutes);

// Define port
const PORT = process.env.PORT || 5000;


// ================== MULTER CONFIG ==================
// Tell Express to serve static files from public folder:
app.use(express.static("public"));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");  
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${uuidv4()}-${file.originalname}`);
  }
});


const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    if (allowed.test(file.mimetype) && allowed.test(file.originalname.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Only jpeg, jpg, png, and gif files are allowed"));
    }
  }
});



// --- upload single image ---
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    imagePath: `/uploads/${req.file.filename}`,  // match what frontend expects
  });
});


// ✅ Multiple Images
app.post("/upload-multiple", upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  res.json({
    message: "Files uploaded successfully",
    count: req.files.length,
    imagePaths,
  });
});



app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
