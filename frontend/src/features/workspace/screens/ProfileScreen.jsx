import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function ProfileScreen() {
  const { profile, setProfile } = useWorkspaceData()
  const [values, setValues] = useState(profile)
  const [saved, setSaved] = useState(false)
  function update(event) { setValues(current => ({ ...current, [event.target.name]: event.target.value })); setSaved(false) }
  function submit(event) { event.preventDefault(); setProfile(values); setSaved(true) }
  return <div className="dash-view"><div className="page-intro"><div><span className="dash-eyebrow">COMPANY PROFILE</span><h1>Put your best introduction forward.</h1><p>Update company details, products, services, documents, and staff.</p></div></div><form className="workspace-form" onSubmit={submit}><div className="upload-box"><UserCircle size={30}/><div><strong>Company logo and documents</strong><p>Choose files to preview uploads before backend storage is connected.</p></div><input type="file" multiple/></div><div className="form-grid"><Field label="Company name"><input name="companyName" value={values.companyName} onChange={update}/></Field><Field label="Contact person"><input name="contactPerson" value={values.contactPerson} onChange={update}/></Field><Field label="Website"><input name="website" value={values.website} onChange={update}/></Field><Field label="Phone"><input name="phone" value={values.phone} onChange={update}/></Field><Field label="Products"><textarea name="products" rows="3" value={values.products} onChange={update}/></Field><Field label="Services"><textarea name="services" rows="3" value={values.services} onChange={update}/></Field><Field label="Booth staff"><textarea name="staff" rows="3" value={values.staff} onChange={update}/></Field><Field label="Company description"><textarea name="description" rows="5" value={values.description} onChange={update}/></Field></div><div className="form-actions">{saved && <span className="form-success"><Check size={15}/> Profile saved</span>}<button className="dash-primary" type="submit">Save profile<Check size={16}/></button></div></form></div>
}

export default ProfileScreen

