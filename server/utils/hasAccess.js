const util = require('util')
const query = util.promisify(connection.query).bind(connection);

module.exports = {
  async toFridge(username, fridgeId) {
    try {
    const findFridge = await query('SELECT `user_access` FROM `fridges` WHERE `id` = ?', [fridgeId])
    if (findFridge.length === 0) {
      return false
    } else {
      const userAccess = JSON.parse(findFridge[0].user_access)
      try {
        const findUser = await query('SELECT `id` from `users` WHERE `username` = ?', [username])
        if (userAccess.findIndex(id => id === findUser[0].id) >= 0) {
          return true
        } else {
          return false
        }
      } catch (findUserError) { console.error(findUserError) }
    }
  } catch (findFridgeError) { console.error(findFridgeError) }
}
}