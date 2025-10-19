const confirmEmailValidationSchema = {
  name: {
    type: 'string',
    required: true
  },
  appearance: {
    type: 'object',
    required: true
  }
}

module.exports = confirmEmailValidationSchema
