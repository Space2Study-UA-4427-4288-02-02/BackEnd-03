const router = require('express').Router()

const langMiddleware = require('~/middlewares/appLanguage')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { restrictTo, authMiddleware } = require('~/middlewares/auth')
const validationMiddleware = require('~/middlewares/validation')

const subjectValidationSchema = require('~/validation/schemas/subject')

const subjectController = require('~/controllers/subject')
const {
  roles: { ADMIN, SUPERADMIN }
} = require('~/consts/auth')

router.use(authMiddleware)
router.get('/', langMiddleware, asyncWrapper(subjectController.getSubjects))
router.get('/names', langMiddleware, asyncWrapper(subjectController.getSubjectsNames))

router.use(restrictTo(ADMIN, SUPERADMIN))
router.post(
  '/',
  validationMiddleware(subjectValidationSchema),
  langMiddleware,
  asyncWrapper(subjectController.createSubject)
)

module.exports = router
