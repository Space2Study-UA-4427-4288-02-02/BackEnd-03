const authService = require('~/services/auth')
const tokenService = require('~/services/token')
const userService = require('~/services/user')
const { OAuth2Client } = require('google-auth-library')

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn()
}))

jest.mock('~/services/user')
jest.mock('~/services/token')

describe('authService.googleAuth', () => {
  const idToken = 'test-id-token'

  beforeEach(() => {
    OAuth2Client.mockClear()
    userService.getUserByEmail.mockReset()
    userService.createGoogleUser.mockReset()
    tokenService.generateTokens.mockReset()
  })

  it('should create user if not exists and return accessToken', async () => {
    const mockPayload = { sub: 'google123', email: 'test@gmail.com', given_name: 'Max', family_name: 'Shim' }

    const fakeVerify = jest.fn().mockResolvedValue({ getPayload: () => mockPayload })
    OAuth2Client.mockImplementationOnce(() => ({ verifyIdToken: fakeVerify }))

    userService.getUserByEmail.mockResolvedValue(null)
    userService.createGoogleUser.mockResolvedValue({ _id: 'user123', role: 'student', isFirstLogin: true })
    tokenService.generateTokens.mockReturnValue({ accessToken: 'access-user123', refreshToken: 'refresh-user123' })

    const result = await authService.googleAuth(idToken)

    expect(result).toEqual({ accessToken: 'access-user123' })
    expect(userService.createGoogleUser).toHaveBeenCalled()
    expect(tokenService.generateTokens).toHaveBeenCalled()
  })

  it('should return token for existing user', async () => {
    const mockPayload = { sub: 'google123', email: 'test@gmail.com' }

    const fakeVerify = jest.fn().mockResolvedValue({ getPayload: () => mockPayload })
    OAuth2Client.mockImplementationOnce(() => ({ verifyIdToken: fakeVerify }))

    userService.getUserByEmail.mockResolvedValue({ _id: 'existingUser', role: 'student', isFirstLogin: false })
    tokenService.generateTokens.mockReturnValue({
      accessToken: 'access-existingUser',
      refreshToken: 'refresh-existingUser'
    })

    const result = await authService.googleAuth(idToken)

    expect(result).toEqual({ accessToken: 'access-existingUser' })
    expect(userService.createGoogleUser).not.toHaveBeenCalled()
  })

  it('should throw error if token is invalid', async () => {
    const fakeVerify = jest.fn().mockRejectedValue(new Error('Invalid token'))
    OAuth2Client.mockImplementationOnce(() => ({ verifyIdToken: fakeVerify }))

    await expect(authService.googleAuth(idToken)).rejects.toThrow('Invalid Google token')
  })
})
