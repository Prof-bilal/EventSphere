import { WorkspaceDataProvider } from '../state/WorkspaceDataContext'

export function AppProviders({ children }) {
  return <WorkspaceDataProvider>{children}</WorkspaceDataProvider>
}
