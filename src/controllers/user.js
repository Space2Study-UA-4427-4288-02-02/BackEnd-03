const userService = require('~/services/user')
const imageService = require('~/services/image')
const { createForbiddenError } = require('~/utils/errorsHelper')
const createAggregateOptions = require('~/utils/users/createAggregateOptions')
const { createError } = require('~/utils/errorsHelper')
const { INTERNAL_SERVER_ERROR, NO_FILE_UPLOADED } = require('~/consts/errors')
const { upload } = require('~/utils/uploadHelper')
const logger = require('~/logger/logger')

const getUsers = async (req, res) => {
  const { skip, limit, sort, match } = createAggregateOptions(req.query)

  const users = await userService.getUsers({ skip, limit, sort, match })

  res.status(200).json(users)
}

const getUserById = async (req, res) => {
  const { id } = req.params
  const { role } = req.query

  const user = await userService.getUserById(id, role)

  res.status(200).json(user)
}

const updateUser = async (req, res) => {
  const { id } = req.params
  const { role } = req.user
  const updateData = req.body

  if (id !== req.user.id) throw createForbiddenError()

  await userService.updateUser(id, role, updateData)

  res.status(204).end()
}

const uploadPhoto = async (req, res) => {
  const { id } = req.params

  if (id !== req.user.id) throw createForbiddenError()

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

    await imageService.addImage(result.public_id, result.secure_url, id)

    const { photo } = await userService.getUserById(id)

    await userService.privateUpdateUser(id, { photo: result.secure_url })

    try {
      if (photo) {
        await imageService.deleteImageByUrl(photo)
      }
    } catch (err) {
      logger.error(err)

      return res.status(500).json({
        status: 500,
        code: INTERNAL_SERVER_ERROR.code,
        message: 'Error destroying from Cloudinary'
      })
    }

    res.status(204).end()
  })
}

const updateStatus = async (req, res) => {
  const { id } = req.params
  const updateData = req.body

  await userService.updateStatus(id, updateData)

  res.status(204).end()
}

const deleteUser = async (req, res) => {
  const { id } = req.params

  await userService.deleteUser(id)

  res.status(204).end()
}

module.exports = {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  updateStatus,
  uploadPhoto
}
