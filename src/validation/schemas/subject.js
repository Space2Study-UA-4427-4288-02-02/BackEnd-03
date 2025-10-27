const subjectValidationSchema = {
  name: {
    type: 'string',
    required: true
  },
  categoryId: {
    type: 'string',
    required: true
  }
}

module.exports = subjectValidationSchema
