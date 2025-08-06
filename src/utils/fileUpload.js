const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ownerId = req.owner.id;
    let uploadPath = "";

        // Handle logo uploads
    if (req.route.path === '/logo') {
        const logoPath = path.join(__dirname, `../../images/${ownerId}/logo/`);
        fs.mkdirSync(logoPath, { recursive: true });
        return cb(null, logoPath);
    }

    ///${itemName.replace(/[^a-z0-9]/gi, '_')}
    if ( req.body !== undefined && req.body !== null && req.body.category_id !== undefined ) {
      uploadPath = path.join(__dirname, `../../images/${ownerId}/${req.body.category_id}`);
    } else if ( req.item !== undefined && req.item !== null && req.item.category_id !== undefined && req.item.category_id !== null) {
      uploadPath = path.join(__dirname, `../../images/${ownerId}/${req.item.category_id}`);
    }else{
      // If neither req.body.category_id nor req.item.category_id is available, return a 500 error
      const err = new Error('Category ID is missing for file upload');
      err.status = 500;
      cb(err);
      return;
    }

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (validExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};



const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer errors (file size, file count)
    return res.status(400).json({
      success: false,
      error: err.message
    });
  } else if (err) {
    // Our custom errors
    return res.status(err.status || 500).json({
      success: false,
      error: err.message
    });
  }
  next();
};
module.exports = {
    upload,
    handleUploadErrors
};