const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📌 تأكد إن فولدر upload موجود
const uploadPath = "upload/";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// 📌 التخزين
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// 📌 فلتر الصور
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// 📌 إعداد multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;