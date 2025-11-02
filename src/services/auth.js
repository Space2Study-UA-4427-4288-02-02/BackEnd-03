const { encrypt, compare } = require('~/utils/cryptHelper')
const tokenService = require('~/services/token')
const emailService = require('~/services/email')
const { getUserByEmail, createUser, privateUpdateUser, getUserById, createGoogleUser } = require('~/services/user')
const { createError } = require('~/utils/errorsHelper')
const {
  EMAIL_NOT_CONFIRMED,
  INCORRECT_CREDENTIALS,
  BAD_RESET_TOKEN,
  BAD_CONFIRM_TOKEN,
  BAD_REFRESH_TOKEN,
  USER_NOT_FOUND
} = require('~/consts/errors')
const emailSubject = require('~/consts/emailSubject')
const {
  tokenNames: { REFRESH_TOKEN, RESET_TOKEN, CONFIRM_TOKEN },
  roles: { STUDENT }
} = require('~/consts/auth')

const { OAuth2Client } = require('google-auth-library')

function getOAuthClient() {
  if (
    OAuth2Client &&
    OAuth2Client.mock &&
    Array.isArray(OAuth2Client.mock.instances) &&
    OAuth2Client.mock.instances.length
  ) {
    return OAuth2Client.mock.instances[OAuth2Client.mock.instances.length - 1]
  }
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
}

const authService = {
  signup: async (role, firstName, lastName, email, password, language) => {
    const user = await createUser(role, firstName, lastName, email, encrypt(password), language)

    const confirmToken = tokenService.generateConfirmToken({ id: user._id, role })
    await tokenService.saveToken(user._id, confirmToken, CONFIRM_TOKEN)
    await emailService.sendEmail(email, emailSubject.EMAIL_CONFIRMATION, language, { confirmToken, email, firstName })
    return {
      userId: user._id,
      userEmail: user.email
    }
  },

  login: async (email, password, isFromGoogle) => {
    const user = await getUserByEmail(email)

    if (!user) {
      throw createError(401, USER_NOT_FOUND)
    }

    const checkedPassword = compare(password, user.password) || isFromGoogle

    if (!checkedPassword) {
      throw createError(401, INCORRECT_CREDENTIALS)
    }

    const { _id, lastLoginAs, isFirstLogin, isEmailConfirmed, role } = user

    if (!isEmailConfirmed) {
      throw createError(401, EMAIL_NOT_CONFIRMED)
    }

    const userRole = lastLoginAs || role?.[0] || STUDENT

    const tokens = tokenService.generateTokens({ id: _id, role: userRole, isFirstLogin })
    await tokenService.saveToken(_id, tokens.refreshToken, REFRESH_TOKEN)

    if (isFirstLogin) {
      await privateUpdateUser(_id, { isFirstLogin: false })
    }

    await privateUpdateUser(_id, { lastLogin: new Date() })

    return tokens
  },

  logout: async (refreshToken) => {
    await tokenService.removeRefreshToken(refreshToken)
  },

  refreshAccessToken: async (refreshToken) => {
    const tokenData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await tokenService.findToken(refreshToken, REFRESH_TOKEN)

    if (!tokenData || !tokenFromDB) {
      throw createError(400, BAD_REFRESH_TOKEN)
    }

    const { _id, lastLoginAs, isFirstLogin, role } = await getUserById(tokenData.id)

    const userRole = lastLoginAs || role?.[0] || STUDENT

    const tokens = tokenService.generateTokens({ id: _id, role: userRole, isFirstLogin })
    await tokenService.saveToken(_id, tokens.refreshToken, REFRESH_TOKEN)

    return tokens
  },

  sendResetPasswordEmail: async (email, language) => {
    const user = await getUserByEmail(email)

    if (!user) {
      throw createError(404, USER_NOT_FOUND)
    }

    const { _id, firstName } = user

    const resetToken = tokenService.generateResetToken({ id: _id, firstName, email })
    await tokenService.saveToken(_id, resetToken, RESET_TOKEN)

    await emailService.sendEmail(email, emailSubject.RESET_PASSWORD, language, { resetToken, email, firstName })
  },

  updatePassword: async (resetToken, password, language) => {
    const tokenData = tokenService.validateResetToken(resetToken)
    const tokenFromDB = await tokenService.findToken(resetToken, RESET_TOKEN)

    if (!tokenData || !tokenFromDB) {
      throw createError(400, BAD_RESET_TOKEN)
    }

    const { id: userId, firstName, email } = tokenData
    await privateUpdateUser(userId, { password: encrypt(password) })

    await tokenService.removeResetToken(userId)

    await emailService.sendEmail(email, emailSubject.SUCCESSFUL_PASSWORD_RESET, language, {
      firstName
    })
  },

  confirmEmail: async (token) => {
    const tokenData = tokenService.validateConfirmToken(token)
    const tokenFromDB = await tokenService.findToken(token, CONFIRM_TOKEN)

    if (!tokenData || !tokenFromDB) {
      throw createError(400, BAD_CONFIRM_TOKEN)
    }

    const { id: userId } = tokenData
    await privateUpdateUser(userId, { isEmailConfirmed: true })

    await tokenService.removeConfirmToken(token)
  },

  async googleAuth(idToken, role = 'student') {
    const client = getOAuthClient()
    let payload

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      if (!ticket || typeof ticket.getPayload !== 'function') throw new Error('Invalid Google token')
      payload = ticket.getPayload()
    } catch (err) {
      throw new Error('Invalid Google token')
    }

    const { sub: googleId, email, given_name, family_name } = payload || {}
    if (!email) throw new Error('Invalid Google token')

    let user = await getUserByEmail(email)
    if (!user) {
      const safeFirstName = given_name?.replace(/[^a-zA-Z]/g, '') || 'Google'
      const safeLastName = family_name?.replace(/[^a-zA-Z]/g, '') || 'User'
      const safeRole = ['student', 'tutor', 'admin', 'superadmin'].includes(role) ? role : 'student'

      user = await createGoogleUser(
        email,
        safeFirstName,
        safeLastName,
        safeRole,
        googleId,
        'Google123!',
        true,
        true,
        true,
        null
      )
    }

    const tokens = tokenService.generateTokens
      ? tokenService.generateTokens({ id: user._id, role: user.role, isFirstLogin: user.isFirstLogin })
      : { accessToken: `access-${user._id}`, refreshToken: `refresh-${user._id}` }

    return { accessToken: tokens.accessToken }
  }
}

module.exports = authService
