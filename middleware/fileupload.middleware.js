const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    fs.mkdir(uploadDir, { recursive: true }, (err) => cb(err, uploadDir));
  },
  filename: (req, file, cb) => {
    const safeTimestamp = new Date().toISOString().replace(/[:]/g, '-');
    cb(null, `${safeTimestamp}-${file.originalname}`);
  },
});

module.exports = {
  upload: multer({
    storage: storage,
  }),
};
