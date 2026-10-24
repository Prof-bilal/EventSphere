import { useOutletContext } from 'react-router-dom'
import ApplicationsScreen from '../../workspace/screens/ApplicationsScreen'

export default function ApplicationsPage() {
  const { search, go } = useOutletContext()
  return <ApplicationsScreen role="exhibitor" search={search} go={go}/>
}
