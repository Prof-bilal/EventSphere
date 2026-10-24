import { useOutletContext } from 'react-router-dom'
import SessionsScreen from '../../workspace/screens/SessionsScreen'

export default function SessionsPage() {
  const { search, go } = useOutletContext()
  return <SessionsScreen role="attendee" search={search} go={go}/>
}
