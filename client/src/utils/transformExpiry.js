import moment from 'moment'

const transformExpiry = expiryDate => {
  let expiry = {}
  const now = moment()
  expiryDate = moment(expiryDate)
  const dayDifference = expiryDate.diff(now, 'days') + 1

  if (!moment(expiryDate).isValid()) {
    return 'Date is not valid'
  }

  expiry.length = moment(expiryDate).from(now)

  if (expiryDate.isAfter(now) && dayDifference >= 4) {
    expiry.keyword = 'Expires '
    expiry.className = 'Success'
  } else if (dayDifference === 0) {
    expiry.keyword = 'Expires '
    expiry.className = 'Neutral'
    expiry.length = 'today'
  } else if (dayDifference >= 1 && dayDifference <= 3) {
    expiry.keyword = 'Expires '
    expiry.className = 'Neutral'
  } else {
    expiry.keyword = 'Expired '
    expiry.className = 'Error'
  }

  expiry.format = expiry.keyword + expiry.length
  expiry.date = moment(expiryDate).format("DD/MM/YYYY")

  return expiry
}

export default transformExpiry
