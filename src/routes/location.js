const router = require('express').Router()
const locationController = require('../controllers/location')

router.get('/countries', locationController.getCountries)
router.get('/countries/:countryCode/cities', locationController.getCities)

module.exports = router
