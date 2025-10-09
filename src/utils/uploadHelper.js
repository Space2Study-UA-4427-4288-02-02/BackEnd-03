const { cloudinaryConfig } = require('~/configs/config')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: cloudinaryConfig.CLOUDINARY_CLOUD_NAME,
  api_key: cloudinaryConfig.CLOUDINARY_API_KEY,
  api_secret: cloudinaryConfig.CLOUDINARY_API_SECRET
})

const upload = (buffer, callback) => {
  cloudinary.uploader.upload_stream({ resource_type: 'auto' }, callback).end(buffer)
}

module.exports = {
  upload
}
