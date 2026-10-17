import Button from '../ui/Button'
import Modal from '../ui/Modal'

export default function ConfirmModal({ open, title = 'Are you sure?', message, confirmLabel = 'Delete', loading = false, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-muted">{message}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-4">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}