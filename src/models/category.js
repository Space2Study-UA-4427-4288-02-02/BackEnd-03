const { Schema, model } = require('mongoose')

const { CATEGORY } = require('~/consts/models')
const { FIELD_CANNOT_BE_EMPTY } = require('~/consts/errors')

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, FIELD_CANNOT_BE_EMPTY('name')],
    unique: true
  },
  appearance: {
    icon: { type: String, required: [true, FIELD_CANNOT_BE_EMPTY('appearance.icon')] },
    color: { type: String, required: [true, FIELD_CANNOT_BE_EMPTY('appearance.color')] }
  }
})

module.exports = model(CATEGORY, categorySchema)
