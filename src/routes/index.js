const router = require('express').Router()

const auth = require('~/routes/auth')
const user = require('~/routes/user')
const email = require('~/routes/email')
const adminInvitation = require('~/routes/adminInvitation')
const question = require('~/routes/question')
const resourcesCategory = require('~/routes/resourcesCategory')
const offer = require('~/routes/offer')
const uploadImage = require('~/routes/uploadImage')
const location = require('~/routes/location')

router.use('/auth', auth)
router.use('/users', user)
router.use('/send-email', email)
router.use('/admin-invitations', adminInvitation)
router.use('/questions', question)
router.use('/resources-categories', resourcesCategory)
router.use('/offers', offer)
router.use('/uploadImage', uploadImage)
router.use('/location', location)

module.exports = router
