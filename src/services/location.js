const axios = require('axios')
const {
  config: { CSC_API_KEY }
} = require('~/configs/config')

const BASE = 'https://api.countrystatecity.in/v1'
const HEADERS = { 'X-CSCAPI-KEY': CSC_API_KEY }

async function fetchCountries() {
  try {
    const res = await axios.get(`${BASE}/countries`, { headers: HEADERS })
    return res.data.map((c) => ({ iso2: c.iso2, name: c.name }))
  } catch (err) {
    console.error('fetchCountries error:', err.message)
    return []
  }
}

async function fetchCitiesByCountry(countryCode) {
  try {
    const statesRes = await axios.get(`${BASE}/countries/${countryCode}/states`, { headers: HEADERS })
    const states = statesRes.data

    const cityPromises = states.map((state) =>
      axios
        .get(`${BASE}/countries/${countryCode}/states/${state.iso2}/cities`, { headers: HEADERS })
        .then((res) =>
          res.data.map((city) => ({
            code: city.name.toUpperCase().replace(/\s+/g, '_'),
            name: city.name
          }))
        )
        .catch(() => [])
    )

    const citiesNested = await Promise.all(cityPromises)
    return citiesNested.flat()
  } catch (err) {
    console.error('fetchCitiesByCountry error:', err.message)
    return []
  }
}

module.exports = {
  fetchCountries,
  fetchCitiesByCountry
}
