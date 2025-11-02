const cateogoryValidationSchema = {
  name: {
    type: 'string',
    required: true
  },
  appearance: {
    type: 'object',
    required: true
  }
}

module.exports = cateogoryValidationSchema
