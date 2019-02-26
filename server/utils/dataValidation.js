const moment = require('moment')

module.exports = {
  check: (value, rules) => {
    let valid = true
    if (rules.isRequired && value === "") {
      valid = false
    }
    if (rules.minLength && value.length < rules.minLength) {
      valid = false
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      valid = false
    }
    if (rules.dateFormat && !moment(value).isValid()) {
      valid = false
    }
    if (rules.sameAs) {
      valid = true
    }
    return valid
  }
}
