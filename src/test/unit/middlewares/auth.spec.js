require('~/initialization/envSetup');

// Мокаємо cryptHelper
jest.mock('~/utils/cryptHelper', () => ({
  encrypt: jest.fn((pwd) => `encrypted-${pwd}`),
  compare: jest.fn((pwd, hash) => pwd === 'password123'),
}));

// Мокаємо User модель
jest.mock('~/models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));
const User = require('~/models/User');

// Мок Google OAuth2Client
const mockVerifyIdToken = jest.fn();
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn(() => ({
    verifyIdToken: mockVerifyIdToken,
  })),
}));

// Після моків імпортуємо сервіс
const authService = require('~/services/auth'); // auth.js

describe('Google Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifyIdToken.mockReset();
  });

  it('should login existing user when google token is valid', async () => {
    const fakePayload = { sub: 'google123', email: 'test@example.com', given_name: 'Test', family_name: 'User' };
    mockVerifyIdToken.mockResolvedValue({ getPayload: () => fakePayload });

    const mockUser = { _id: 'user123', role: 'student' };
    User.findOne.mockResolvedValue(mockUser);

    const result = await authService.googleAuth('valid_id_token', 'student');

    expect(mockVerifyIdToken).toHaveBeenCalledWith({
      idToken: 'valid_id_token',
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(result).toHaveProperty('user', mockUser);
    expect(result).toHaveProperty('tokens');
  });

  it('should throw error when google token is invalid', async () => {
    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));
    await expect(authService.googleAuth('bad_token', 'student'))
      .rejects.toThrow('Invalid Google token');
  });

  it('should create new user if not exists', async () => {
    const fakePayload = { sub: 'google456', email: 'newuser@example.com', given_name: 'New', family_name: 'User' };
    mockVerifyIdToken.mockResolvedValue({ getPayload: () => fakePayload });

    User.findOne.mockResolvedValue(null);
    const mockCreatedUser = {
      _id: 'newuser123', email: 'newuser@example.com', firstName: 'New', lastName: 'User',
      role: 'student', googleId: 'google456', password: 'Google123!',
      isGoogleAccount: true, isEmailConfirmed: true, isFirstLogin: true, lastLogin: null
    };
    User.create.mockResolvedValue(mockCreatedUser);

    const result = await authService.googleAuth('new_token', 'student');

    expect(User.findOne).toHaveBeenCalledWith({ email: 'newuser@example.com' });
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
      email: 'newuser@example.com',
      firstName: 'New',
      lastName: 'User',
      role: 'student',
      googleId: 'google456',
      password: expect.any(String),
      isGoogleAccount: true,
      isEmailConfirmed: true,
      isFirstLogin: true,
    }));
    expect(result).toHaveProperty('user', mockCreatedUser);
    expect(result).toHaveProperty('tokens');
  });

  it('should throw error if payload has no email', async () => {
    const fakePayload = { sub: 'google789', given_name: 'NoEmail', family_name: 'User' };
    mockVerifyIdToken.mockResolvedValue({ getPayload: () => fakePayload });

    await expect(authService.googleAuth('token_without_email', 'student'))
      .rejects.toThrow('Invalid Google token');
  });

  it('should sanitize non-alphabetic characters in names', async () => {
    const fakePayload = { sub: 'google999', email: 'special@example.com', given_name: 'N3w@123', family_name: 'Us#er!' };
    mockVerifyIdToken.mockResolvedValue({ getPayload: () => fakePayload });

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: 'special123', email: 'special@example.com', firstName: 'Nw', lastName: 'User',
      role: 'student', googleId: 'google999', password: 'Google123!',
      isGoogleAccount: true, isEmailConfirmed: true, isFirstLogin: true, lastLogin: null
    });

    const result = await authService.googleAuth('token_with_special_chars', 'student');

    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
      firstName: 'Nw',
      lastName: 'User',
    }));
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('tokens');
  });

  it('should default to student role if invalid role provided', async () => {
    const fakePayload = { sub: 'google111', email: 'rolefail@example.com', given_name: 'Role', family_name: 'Fail' };
    mockVerifyIdToken.mockResolvedValue({ getPayload: () => fakePayload });

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: 'role123', email: 'rolefail@example.com', firstName: 'Role', lastName: 'Fail',
      role: 'student', googleId: 'google111', password: 'Google123!',
      isGoogleAccount: true, isEmailConfirmed: true, isFirstLogin: true, lastLogin: null
    });

    const result = await authService.googleAuth('token_invalid_role', 'hacker');

    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ role: 'student' }));
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('tokens');
  });
});
