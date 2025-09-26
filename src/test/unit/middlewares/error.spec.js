require('~/initialization/envSetup')
const errorMiddleware = require('~/middlewares/error')

describe('Error middleware', () => {
  const mockRequest = {}
  const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
    return res
  }
  const mockNextFunc = jest.fn()

  it('Should return MONGO_SERVER_ERROR when code 11000', () => {
    const mockError = { name: 'MongoServerError', status: 'status', code: 11000, message: '{name:} error message' }
    const res = mockResponse()

    errorMiddleware(mockError, mockRequest, res, mockNextFunc)

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
      code: 'DOCUMENT_ALREADY_EXISTS',
      status: 409,
      message: "'name' field(s) must be unique."
    })
  })

  it('Should return MONGO_SERVER_ERROR when specific code not set', () => {
    const mockError = { name: 'MongoServerError', status: 'status', message: 'Error message' }
    const res = mockResponse()

    errorMiddleware(mockError, mockRequest, res, mockNextFunc)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      code: 'MONGO_SERVER_ERROR',
      status: 500,
      message: 'Error message'
    })
  })

  it('Should return VALIDATION_ERROR', () => {
    const mockError = { name: 'ValidationError', status: 'status', code: 400, message: 'Error message' }
    const res = mockResponse()

    errorMiddleware(mockError, mockRequest, res, mockNextFunc)

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
      code: 'VALIDATION_ERROR',
      status: 409,
      message: 'Error message'
    })
  })

  it('Should return internal server error in case status and code not set', () => {
    const mockError = { message: 'Internal error message' }
    const res = mockResponse()

    errorMiddleware(mockError, mockRequest, res, mockNextFunc)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      code: 'INTERNAL_SERVER_ERROR',
      status: 500,
      message: 'Internal error message'
    })
  })
})
