const { INTERNAL_SERVER_ERROR, NO_FILE_UPLOADED } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')
const { cloudinaryConfig } = require('~/configs/config')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: cloudinaryConfig.CLOUDINARY_CLOUD_NAME,
  api_key: cloudinaryConfig.CLOUDINARY_API_KEY,
  api_secret: cloudinaryConfig.CLOUDINARY_API_SECRET
})

const upload = async (req, res) => {
  if (!req.file) {
    return createError(400, NO_FILE_UPLOADED)
  }

  cloudinary.uploader
    .upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) {
        return res.status(500).json({
          status: 500,
          code: INTERNAL_SERVER_ERROR.code,
          message: 'Error uploading to Cloudinary'
        })
      }
      res.status(200).json({ url: result.secure_url })
    })
    .end(req.file.buffer)
}

module.exports = {
  upload
}
