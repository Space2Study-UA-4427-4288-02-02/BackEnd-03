const { Schema, model } = require('mongoose')

const { CATEGORY } = require('~/consts/models')
const { FIELD_CANNOT_BE_EMPTY, FIELD_MUST_BE_UNIQUE } = require('~/consts/errors')

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, FIELD_CANNOT_BE_EMPTY('name')],
    unique: [true, FIELD_MUST_BE_UNIQUE('name')]
  },
  appearance: {
    icon: { type: String, required: [true, FIELD_CANNOT_BE_EMPTY('appearance.icon')] },
    color: { type: String, required: [true, FIELD_CANNOT_BE_EMPTY('appearance.color')] }
  }
})

module.exports = model(CATEGORY, categorySchema)
