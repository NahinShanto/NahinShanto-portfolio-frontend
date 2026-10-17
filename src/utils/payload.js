export function buildPayload(values, fields) {
  const data = {}
  let hasFile = false

  fields.forEach((f) => {
    const v = values[f.name]
    switch (f.type) {
      case 'image':
      case 'file':
        if (v instanceof File) {
          data[f.name] = v
          hasFile = true
        }
        break
      case 'multi':
        data[f.name] = (v ?? []).map(Number)
        break
      case 'checkbox':
        data[f.name] = Boolean(v)
        break
      case 'number':
        data[f.name] = v === '' || v == null ? null : Number(v)
        break
      case 'date':
        data[f.name] = v || null
        break
      case 'select':
        data[f.name] = v === '' ? (f.nullable ? null : '') : v
        break
      default:
        data[f.name] = typeof v === 'string' ? v.trim() : v
    }
  })

  if (!hasFile) return data
  const fd = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => fd.append(key, item))
    else if (value !== null && value !== undefined) fd.append(key, value)
  })
  return fd
}