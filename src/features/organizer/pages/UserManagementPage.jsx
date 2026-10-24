import { useOutletContext } from 'react-router-dom'
import UsersScreen from '../../workspace/screens/UsersScreen'

export default function UserManagementPage() {
  const { search, go } = useOutletContext()
  return <UsersScreen role="organizer" search={search} go={go}/>
}
