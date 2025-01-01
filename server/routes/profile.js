const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "images.json");

// Helper function to read/write the JSON fil
const readImageArray = () => {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    if (data.trim()) {
      // Ensure data is not empty before parsing
      return JSON.parse(data);
    }
  }

  return [];
};

const writeImageArray = (imageArray) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(imageArray, null, 2));
};

//configure storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), null); // Error and no destination
    }
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    if (!file.originalname) {
      return cb(new Error("File name is invalid!"), null); // Error if filename is invalid
    }
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create multer upload middleware
const upload = multer({ storage: storage });

router.post("/api/images/upload", upload.single("upload_file"), (req, res) => {
  const imageArray = readImageArray();
  imageArray.push(req.file.filename);
  writeImageArray(imageArray);
  res.json({
    data: imageArray,
    message: "image UPLOADED successfully",
  });
});

router.get("/api/images", (req, res) => {
  const imageArray = readImageArray();

  if (imageArray) {
    return res.json({
      data: imageArray,
    });
  }
  
});

module.exports = router;
