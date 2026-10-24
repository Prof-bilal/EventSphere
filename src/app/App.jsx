import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'
import { AppProviders } from './providers'
import '../index.css'
import '../dashboard.css'
import '../auth.css'
import '../public-pages.css'

export default function App() { return <AppProviders><BrowserRouter><AppRouter/></BrowserRouter></AppProviders> }
