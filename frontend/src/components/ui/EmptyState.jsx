import { Search } from 'lucide-react'
export default function EmptyState({ title, copy }) { return <div className="empty-state"><Search size={28}/><h3>{title}</h3><p>{copy}</p></div> }
