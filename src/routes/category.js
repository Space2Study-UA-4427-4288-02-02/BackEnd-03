const router = require('express').Router()

const langMiddleware = require('~/middlewares/appLanguage')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { restrictTo, authMiddleware } = require('~/middlewares/auth')

const categoryController = require('~/controllers/category')
const {
  roles: { ADMIN, SUPERADMIN }
} = require('~/consts/auth')

router.use(authMiddleware)
router.get('/', langMiddleware, asyncWrapper(categoryController.getCategories))
router.get('/names', langMiddleware, asyncWrapper(categoryController.getCategoriesNames))

router.use(restrictTo(ADMIN, SUPERADMIN))
router.post('/', langMiddleware, asyncWrapper(categoryController.createCategory))

module.exports = router
