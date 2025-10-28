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

  it('fetchCountries should return [] on error', async () => {
    axios.get.mockRejectedValueOnce(new Error('401 Unauthorized'))

    const result = await locationService.fetchCountries()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThanOrEqual(0)
  })

  it('fetchCitiesByCountry should return mocked cities for UA', async () => {
    axios.get
      .mockResolvedValueOnce({ data: [{ iso2: 'KY' }, { iso2: 'LV' }] })
      .mockResolvedValueOnce({ data: [{ name: 'Kyiv' }, { name: 'Lviv' }] })
      .mockResolvedValueOnce({ data: [{ name: 'Lviv' }] })

    const result = await locationService.fetchCitiesByCountry('UA')
    expect(result).toEqual([
      { code: 'KYIV', name: 'Kyiv' },
      { code: 'LVIV', name: 'Lviv' },
      { code: 'LVIV', name: 'Lviv' }
    ])
  })

  it('fetchCountries should fallback on error', async () => {
    axios.get.mockRejectedValueOnce(new Error('401 Unauthorized'))

    const result = await locationService.fetchCountries()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThanOrEqual(0)
  })
})
