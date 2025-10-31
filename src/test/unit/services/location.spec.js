describe('locationService', () => {
  let locationService
  let axios

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    jest.doMock('axios', () => {
      const realAxios = jest.requireActual('axios')
      return {
        ...realAxios,
        get: jest.fn()
      }
    })

    axios = require('axios')
    locationService = require('~/services/location')
  })

  it('fetchCountries should throw on error', async () => {
    axios.get.mockRejectedValueOnce(new Error('401 Unauthorized'))

    await expect(locationService.fetchCountries()).rejects.toThrow('Failed to fetch countries')
  })

  it('fetchCitiesByCountry should return mocked cities for UA', async () => {
    // 1. states
    axios.get
      .mockResolvedValueOnce({ data: [{ iso2: 'KY' }, { iso2: 'LV' }] })
      // 2. cities for KY
      .mockResolvedValueOnce({ data: [{ name: 'Kyiv' }, { name: 'Lviv' }] })
      // 3. cities for LV
      .mockResolvedValueOnce({ data: [{ name: 'Lviv' }] })

    const result = await locationService.fetchCitiesByCountry('UA')

    expect(result).toEqual([
      {
        code: 'UA_KY_KYIV',
        name: 'Kyiv',
        state: undefined,
        stateCode: 'KY',
        countryCode: 'UA'
      },
      {
        code: 'UA_KY_LVIV',
        name: 'Lviv',
        state: undefined,
        stateCode: 'KY',
        countryCode: 'UA'
      },
      {
        code: 'UA_LV_LVIV',
        name: 'Lviv',
        state: undefined,
        stateCode: 'LV',
        countryCode: 'UA'
      }
    ])
  })

  it('fetchCitiesByCountry should throw on invalid country code', async () => {
    await expect(locationService.fetchCitiesByCountry('UKRAINE')).rejects.toThrow('Invalid country code format')
  })
})
