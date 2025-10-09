const router = require('express').Router()
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')

const uploadImageController = require('~/controllers/uploadImage')

router.use(authMiddleware)

router.post('/', upload.single('image'), asyncWrapper(uploadImageController.uploadImage))

module.exports = router
