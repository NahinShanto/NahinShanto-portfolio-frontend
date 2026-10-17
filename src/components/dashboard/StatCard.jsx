import Card from '../ui/Card'

export default function StatCard({ label, value, hint }) {
  return (
    <Card className="p-6">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-heading text-2xl">{value}</p>
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
    </Card>
  )
}