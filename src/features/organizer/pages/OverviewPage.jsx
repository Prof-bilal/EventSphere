import { useOutletContext } from 'react-router-dom'
import OverviewScreen from '../../workspace/screens/OverviewScreen'

export default function OverviewPage() {
  const { search, go } = useOutletContext()
  return <OverviewScreen role="organizer" search={search} go={go}/>
}
