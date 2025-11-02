const { INTERNAL_SERVER_ERROR, NO_FILE_UPLOADED } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')
const { upload } = require('~/utils/uploadHelper')
const imageService = require('~/services/image')

const uploadImage = async (req, res) => {
  if (!req.file) {
    return createError(400, NO_FILE_UPLOADED)
  }

  upload(req.file.buffer, async (error, result) => {
    if (error) {
      return res.status(500).json({
        status: 500,
        code: INTERNAL_SERVER_ERROR.code,
        message: 'Error uploading to Cloudinary'
      })
    }

    await imageService.addImage(result.public_id, result.secure_url, req.user.id)

    res.status(200).json({ url: result.secure_url })
  })
}

module.exports = {
  uploadImage
}
