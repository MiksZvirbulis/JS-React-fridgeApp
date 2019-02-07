import moment from 'moment'

const checkValidity = (value, rules, sameAs = null) => {
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
    if (sameAs) {
        if (value !== sameAs) {
            valid = false
        }
    }
    if (rules.dateFormat && !moment(value).isValid()) {
        valid = false
    }
    return valid
}

export default checkValidity