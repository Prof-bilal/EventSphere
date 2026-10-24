export function Field({ label, error, children }) { return <label className="workspace-field"><span>{label}</span>{children}{error && <small>{error}</small>}</label> }
