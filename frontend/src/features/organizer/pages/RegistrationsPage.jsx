import { useOutletContext } from 'react-router-dom'
import RegistrationsScreen from '../../workspace/screens/RegistrationsScreen'

export default function RegistrationsPage() {
  const { search, go } = useOutletContext()
  return <RegistrationsScreen role="organizer" search={search} go={go}/>
}
