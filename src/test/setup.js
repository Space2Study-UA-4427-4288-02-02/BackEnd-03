const express = require('express')
const mongoose = require('mongoose')
const request = require('supertest')
require('~/initialization/envSetup')

const serverSetup = require('~/initialization/serverSetup')

const serverInit = async () => {
  const app = express()
  await serverSetup(app)
  const httpServer = app.listen(0)
  return { app: request(app), server: httpServer }
}

const serverCleanup = async () => {
  await mongoose.connection.db.dropDatabase()
}

const stopServer = async (server) => {
  await mongoose.connection.close()
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()))
  })
}

module.exports = { serverInit, serverCleanup, stopServer }
