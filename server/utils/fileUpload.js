const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const uploadDir = path.join(__dirname, '../../uploads');
const idDir = path.join(uploadDir, 'ids');
const photoDir = path.join(uploadDir, 'photos');
const evidenceDir = path.join(uploadDir, 'evidence');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

if (!fs.existsSync(idDir)) {
  fs.mkdirSync(idDir);
}

if (!fs.existsSync(photoDir)) {
  fs.mkdirSync(photoDir);
}

if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir);
}

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.fieldname === 'photo') {
      cb(null, photoDir);
    } else if (file.fieldname === 'idDocument') {
      cb(null, idDir);
    } else if (file.fieldname === 'evidence') {
      cb(null, evidenceDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images, pdf, and common doc types
  if (file.mimetype.startsWith('image/') || 
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format'), false);
  }
};

// Set up multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter: fileFilter
});

module.exports = { upload }; 