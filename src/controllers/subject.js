const subjectService = require('~/services/subject')

const createSubject = async (req, res) => {
  const { name, categoryId } = req.body

  const subject = await subjectService.createSubject(name, categoryId)

  res.status(201).json(subject)
}

const getSubjects = async (_, res) => {
  const subjects = await subjectService.getSubjects()

  res.status(200).json(subjects)
}

const getSubjectsNames = async (req, res) => {
  const { categoryId } = req.query

  const subjectsNames = await subjectService.getSubjectsNames(categoryId)

  res.status(200).json(subjectsNames)
}

module.exports = {
  createSubject,
  getSubjects,
  getSubjectsNames
}
