// একবার UUID বানিয়ে localStorage-এ রাখে, প্রতিটা request-এ X-Visitor-Id হিসেবে যায়
export function getVisitorId() {
  let id = localStorage.getItem('visitor_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('visitor_id', id)
  }
  return id
}

export default function useVisitorId() {
  return getVisitorId()
}