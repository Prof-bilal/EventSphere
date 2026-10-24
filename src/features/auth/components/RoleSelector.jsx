import { LayoutGrid, Users } from 'lucide-react'

const roles = [{ value: 'exhibitor', label: 'Exhibitor', icon: LayoutGrid, description: 'I’m showcasing a brand' }, { value: 'attendee', label: 'Attendee', icon: Users, description: 'I’m here to discover' }]

export default function RoleSelector({ value, onChange }) { return <fieldset className="role-picker"><legend>I’m joining as an</legend><div className="role-options">{roles.map(role => { const Icon = role.icon; return <label className={value === role.value ? 'role-option selected' : 'role-option'} key={role.value}><input type="radio" name="role" value={role.value} checked={value === role.value} onChange={() => onChange(role.value)}/><Icon size={20} strokeWidth={1.5}/><strong>{role.label}</strong><span>{role.description}</span></label> })}</div></fieldset> }
