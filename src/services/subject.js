const mongoose = require('mongoose')

const Subject = require('~/models/subject')
const { createError } = require('~/utils/errorsHelper')
const { SUBJECT_NAME_NOT_UNIQUE, INVALID_ID } = require('~/consts/errors')

const subjectService = {
  createSubject: async (name, categoryId) => {
    const duplicateSubject = await Subject.findOne({ name }).lean().exec()

    if (duplicateSubject) {
      throw createError(400, SUBJECT_NAME_NOT_UNIQUE)
    }

    return await Subject.create({
      name,
      categoryId
    })
  },

  getSubjects: async () => {
    return await Subject.find().lean().exec()
  },

  getSubjectsNames: async (categoryId) => {
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      throw createError(400, INVALID_ID)
    }

    return await Subject.find(categoryId ? { categoryId } : null)
      .select('name')
      .exec()
  }
}

module.exports = subjectService
