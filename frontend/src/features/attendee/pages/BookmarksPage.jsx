import { useOutletContext } from 'react-router-dom'
import BookmarksScreen from '../../workspace/screens/BookmarksScreen'

export default function BookmarksPage() {
  const { search, go } = useOutletContext()
  return <BookmarksScreen role="attendee" search={search} go={go}/>
}
