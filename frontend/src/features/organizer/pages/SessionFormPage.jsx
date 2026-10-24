import { useOutletContext, useParams } from 'react-router-dom'
import SessionFormScreen from '../../workspace/screens/SessionFormScreen'

export default function SessionFormPage() {
  const { go } = useOutletContext()
  const { editId } = useParams()
  return <SessionFormScreen editId={editId} go={go}/>
}
