import { useOutletContext } from 'react-router-dom'
import ExposScreen from '../../workspace/screens/ExposScreen'

export default function ExposPage() {
  const { search, go } = useOutletContext()
  return <ExposScreen role="exhibitor" search={search} go={go}/>
}
