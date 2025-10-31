const locationService = require('../services/location')

async function getCountries(req, res) {
  try {
    const countries = await locationService.fetchCountries()
    res.json(countries)
  } catch (err) {
    console.error('getCountries error:', err.message)
    res.status(502).json({ error: err.message })
  }
}

async function getCities(req, res) {
  try {
    const { countryCode } = req.params
    const cities = await locationService.fetchCitiesByCountry(countryCode)
    res.json(cities)
  } catch (err) {
    console.error('getCities error:', err.message)
    res.status(502).json({ error: err.message })
  }
}

module.exports = { getCountries, getCities }
