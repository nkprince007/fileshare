const multer = require('multer')
const utils = require('./utils')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, utils.getFolder(req.session.email))
  },
  filename: (req, file, cb) => {
    let filename = file.originalname
    if (file.mimetype.match('video/.*')) {
      filename = `${filename}.mp4`
    }
    cb(null, filename)
  }
})
const upload = multer({ storage })

module.exports = {
  upload, storage
}
