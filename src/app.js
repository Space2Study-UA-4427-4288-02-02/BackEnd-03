require('module-alias/register');
const express = require('express')
const cookieParser = require('cookie-parser')
const serverSetup = require('./initialization/serverSetup')
const logger = require('~/logger/logger')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // ← додай це
app.use(cookieParser())

const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)

const start = async () => {
  try {
    await serverSetup(app)
  } catch (err) {
    logger.error(err)
  }
}

start()
