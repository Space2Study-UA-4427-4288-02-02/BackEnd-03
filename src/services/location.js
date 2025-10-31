const axios = require('axios')
const {
  config: { CSC_API_KEY }
} = require('~/configs/config')

const api = axios.create({
  baseURL: process.env.BASE,
  headers: { 'X-CSCAPI-KEY': CSC_API_KEY },
  timeout: 10000
})

async function fetchCountries() {
  try {
    const res = await api.get('/countries')
    return res.data.map((c) => ({
      iso2: c.iso2,
      name: c.name
    }))
  } catch (err) {
    console.error('fetchCountries error:', err.message)
    throw new Error(`Failed to fetch countries: ${err.message}`)
  }
}

async function fetchCitiesByCountry(countryCode) {
  if (!/^[A-Z]{2}$/i.test(countryCode)) {
    throw new Error('Invalid country code format')
  }

  try {
    const statesRes = await api.get(`/countries/${countryCode.toUpperCase()}/states`)
    const states = statesRes.data

    const cityPromises = states.map((state) =>
      api
        .get(`/countries/${countryCode.toUpperCase()}/states/${state.iso2}/cities`)
        .then((res) =>
          res.data.map((city) => ({
            code: `${countryCode.toUpperCase()}_${state.iso2}_${city.name.toUpperCase().replace(/\s+/g, '_')}`,
            name: city.name,
            state: state.name,
            stateCode: state.iso2,
            countryCode: countryCode.toUpperCase()
          }))
        )
        .catch((err) => {
          console.error(`Failed to fetch cities for state ${state.iso2}:`, err.message)
          return []
        })
    )

    const citiesNested = await Promise.all(cityPromises)
    return citiesNested.flat()
  } catch (err) {
    console.error('fetchCitiesByCountry error:', err.message)
    throw new Error(`Failed to fetch cities for ${countryCode}: ${err.message}`)
  }
}

module.exports = {
  fetchCountries,
  fetchCitiesByCountry
}
