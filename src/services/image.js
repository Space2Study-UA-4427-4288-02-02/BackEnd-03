const Image = require('~/models/image')
const { destroy } = require('~/utils/uploadHelper')

const imageService = {
  addImage: async (publicId, url, uploadedBy) => {
    return Image.create({ publicId, url, uploadedBy })
  },

  deleteImageByUrl: async (url) => {
    const image = await Image.findOne({ url }).lean().exec()

    if (image?.publicId) {
      await destroy(image.publicId)
      await Image.findByIdAndRemove(image._id).exec()
    }
  }
}

module.exports = imageService
