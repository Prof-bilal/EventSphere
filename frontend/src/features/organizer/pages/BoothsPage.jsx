import { useOutletContext } from 'react-router-dom'
import BoothsScreen from '../../workspace/screens/BoothsScreen'

export default function BoothsPage() {
  const { search, go } = useOutletContext()
  return <BoothsScreen role="organizer" search={search} go={go}/>
}
