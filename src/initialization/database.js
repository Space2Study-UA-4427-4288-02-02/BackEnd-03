const mongoose = require('mongoose')

const {
  config: { MONGODB_URL }
} = require('../configs/config')
const logger = require('../logger/logger')

mongoose.set('strictQuery', false)

const dropAllCollections = async () => {
  const collections = await mongoose.connection.db.collections()
  const areDropped = collections.map((collection) => collection.drop())
  await Promise.all(areDropped)
}

const checkForLocalDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    await dropAllCollections()
  }
}

const databaseInitialization = async () => {
  try {
    await mongoose.connect(MONGODB_URL)
    await checkForLocalDB()
    logger.info(`Connected to MongoDB at ${MONGODB_URL}`)
  } catch (err) {
    logger.error('Database connection error:', err)
    process.exit(1)
  }
}

module.exports = databaseInitialization
