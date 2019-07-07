export default (timestamp, format) => {
  const date = new Date(timestamp * 1000)
  if (format === 'date') {
    return date.toLocaleDateString()
  } else if (format === 'time') {
    return date.toLocaleTimeString()
  }
  return date.toLocaleString()
}
