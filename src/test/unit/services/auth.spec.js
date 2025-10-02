require('~/initialization/envSetup')
const User = require('~/models/user')
const tokenService = require('~/services/token')
const authService = require('~/services/auth')
const { createError } = require('~/utils/errorsHelper')
const { BAD_CONFIRM_TOKEN } = require('~/consts/errors')

describe('Auth service', () => {
  it('Should confirm user email by providing valid token', async () => {
    User.findOneAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({ save: jest.fn() })
    })
    jest.spyOn(tokenService, 'validateConfirmToken').mockResolvedValue(true)
    jest.spyOn(tokenService, 'findToken').mockResolvedValue(true)
    jest.spyOn(tokenService, 'removeConfirmToken').mockResolvedValue()
    const token = 'tokenExample'

    await authService.confirmEmail(token)

    expect(tokenService.removeConfirmToken).toHaveBeenCalledWith(token)
  })

  it('Should throw error BAD_CONFIRM_TOKEN in confirmEmail func', () => {
    jest.spyOn(tokenService, 'validateConfirmToken').mockResolvedValue(false)
    jest.spyOn(tokenService, 'findToken').mockResolvedValue(false)
    const token = 'tokenExample'
    const err = createError(400, BAD_CONFIRM_TOKEN)
    const serviceFunc = () => authService.confirmEmail(token)

    expect(serviceFunc).rejects.toThrow(err)
  })
})
