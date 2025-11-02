const getRegex = (regex = '') => {
  const escapedRegex = regex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  return {
    $regex: escapedRegex.length > 0 ? escapedRegex : '.*',
    $options: 'i'
  }
}

module.exports = getRegex
