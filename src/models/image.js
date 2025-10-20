const { Schema, model } = require('mongoose')
const { IMAGE, USER } = require('~/consts/models')

const imageSchema = new Schema({
  publicId: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: USER
  }
})

module.exports = model(IMAGE, imageSchema)
