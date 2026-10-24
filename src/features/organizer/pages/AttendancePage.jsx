import { useOutletContext } from 'react-router-dom'
import AttendanceScreen from '../../workspace/screens/AttendanceScreen'

export default function AttendancePage() {
  const { search, go } = useOutletContext()
  return <AttendanceScreen role="organizer" search={search} go={go}/>
}
