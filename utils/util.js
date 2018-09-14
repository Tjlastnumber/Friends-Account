const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  // const day = date.getDate()
  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [year, month].map(formatNumber).join('-')// + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isEmpty = n => {
  return n === null || n === undefined || n === ''
}

const today = () => {
  var date = new Date()
  const year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        week = date.getDay()
  date = null
  return {
    year: year, 
    month: month,
    day: day,
    week: week
  }
}

const isObject = (obj) => {
  return obj !== null && typeof obj === 'object'
}

const toNumber = (val) => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

module.exports = {
  formatTime: formatTime,
  today: today,
  isObject: isObject,
  toNumber: toNumber,
  isEmpty: isEmpty
}