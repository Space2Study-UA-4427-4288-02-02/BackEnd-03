require('~/initialization/envSetup')
const { encrypt, compare } = require('~/utils/cryptHelper')

describe('cryptHelper', () => {
  describe('encrypt', () => {
    it('should encrypt password', () => {
      const plaintext = 'password'
      const encrypted = encrypt(plaintext)
      expect(encrypted).not.toEqual(plaintext)
    })
  })

  describe('compare', () => {
    it('should return true for matching plaintext and hash', () => {
      const plaintext = 'password'
      const hash = encrypt(plaintext)
      const result = compare(plaintext, hash)
      expect(result).toBe(true)
    })

    it('should return false for non-matching plaintext and hash', () => {
      const plaintext = 'password'
      const hash = encrypt(plaintext)
      const result = compare('Wrong Password', hash)
      expect(result).toBe(false)
    })
  })
})
