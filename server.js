const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const url = `${req.protocol}://${req.get("host")}/raw/${req.file.filename}`;
  res.json({ success: true, url });
});

app.get("/raw/:filename", (req, res) => {
  const filePath = path.join(uploadFolder, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");
  res.setHeader("Content-Type", "text/javascript");
  fs.createReadStream(filePath).pipe(res);
});

app.listen(PORT, () => console.log(`ADC API running on port ${PORT}`));
