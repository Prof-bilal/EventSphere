export default function StatusBadge({ value }) { return <span className={`status-pill ${String(value).toLowerCase().replaceAll(' ', '-')}`}>{value}</span> }
