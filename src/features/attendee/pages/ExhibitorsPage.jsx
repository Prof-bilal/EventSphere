import { useOutletContext } from 'react-router-dom'
import ExhibitorsScreen from '../../workspace/screens/ExhibitorsScreen'

export default function ExhibitorsPage() {
  const { search, go } = useOutletContext()
  return <ExhibitorsScreen role="attendee" search={search} go={go}/>
}
