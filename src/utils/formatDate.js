const make = (options) => (value) =>
  value ? new Intl.DateTimeFormat('en-US', options).format(new Date(value)) : ''

export const formatDate = make({ year: 'numeric', month: 'short', day: 'numeric' })
export const formatMonthYear = make({ year: 'numeric', month: 'short' })