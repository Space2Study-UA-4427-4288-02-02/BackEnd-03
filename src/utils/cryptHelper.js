const bcrypt = require('bcrypt')
const saltRounds = 10

const encrypt = (password) => bcrypt.hashSync(password, saltRounds)

const compare = (password, hash) => bcrypt.compareSync(password, hash)

module.exports = {
  encrypt,
  compare
}