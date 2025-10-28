const locationService = require('../services/location')

async function getCountries(req, res) {
  const countries = await locationService.fetchCountries()
  res.json(countries)
}

async function getCities(req, res) {
  const { countryCode } = req.params
  const cities = await locationService.fetchCitiesByCountry(countryCode)
  res.json(cities)
}

async function selectLocation(req, res) {
  const { countryCode, cityCode } = req.body

  if (!countryCode || !cityCode) {
    return res.status(400).json({ message: 'countryCode and cityCode are required' })
  }

  res.json({ country: countryCode, city: cityCode })
}

module.exports = {
  getCountries,
  getCities,
  selectLocation
}
