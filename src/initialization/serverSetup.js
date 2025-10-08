const databaseInitialization = require('./database')
const checkUserExistence = require('../seed/checkUserExistence')
const initialization = require('~/initialization/initialization')
const logger = require('~/logger/logger')
const {
  config: { SERVER_PORT }
} = require('~/configs/config')
const scheduledCronJobs = require('~/cron-jobs/scheduledCronJobs')

const serverSetup = async (app) => {
  await databaseInitialization()
  await checkUserExistence()
  initialization(app)

  let server = null
  if (process.env.NODE_ENV !== 'test') {
    server = app.listen(SERVER_PORT, () => {
      logger.info(`Server is running on port ${SERVER_PORT}`)
      scheduledCronJobs()
    })
  }

  return { app, server }  // повертаємо обидва
}

module.exports = serverSetup

