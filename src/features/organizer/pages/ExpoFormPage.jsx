import { useOutletContext, useParams } from 'react-router-dom'
import ExpoFormScreen from '../../workspace/screens/ExpoFormScreen'

export default function ExpoFormPage() {
  const { go } = useOutletContext()
  const { editId } = useParams()
  return <ExpoFormScreen editId={editId} go={go}/>
}
