interface Props {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <p className="dialog__message">{message}</p>
        <div className="dialog__actions">
          <button className="btn btn-secondary" onClick={onCancel}>Non</button>
          <button className="btn btn-danger" onClick={onConfirm}>Oui</button>
        </div>
      </div>
    </div>
  )
}
