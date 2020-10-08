const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, `src/uploads`)
  },
  filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}.png`)
  }
})

const upload = multer({
  storage,
  limits: {fileSize: 1000000},
  fileFilter(req, file, callback) {
      if(file.originalname.match(/\.(jpg|jpeg|png)\b/)) {
          callback(null, true)
      } else {
          callback('File must be png/jpg/jpeg, max size 1mb', null)
      }
  }
})

module.exports = upload;