import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { api } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [notice, setNotice] = useState('')

  useEffect(() => {
    async function checkLogin() {
      if (localStorage.getItem('token')) {
        try {
          const data = await api('/auth/profile')
          setUser(data.user)
        } catch (error) {
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    checkLogin()
  }, [])

  useEffect(() => {
    if (!user) {
      setNotifications([])
      return
    }
    let active = true
    api('/notification')
      .then((data) => {
        if (active) setNotifications(data)
      })
      .catch((error) => setNotice(error.message))
    const socket = io({ auth: { token: localStorage.getItem('token') } })
    socket.on('notification:new', (notification) => {
      setNotifications((items) => [
        notification,
        ...items.filter((item) => item._id !== notification._id),
      ])
      setNotice(notification.message)
      window.dispatchEvent(new Event('event-updated'))
    })
    socket.on('event:updated', () => window.dispatchEvent(new Event('event-updated')))
    return () => {
      active = false
      socket.disconnect()
    }
  }, [user])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(''), 5000)
    return () => clearTimeout(timer)
  }, [notice])

  async function logout() {
    await api('/auth/logout', 'POST')
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, logout, notifications, setNotifications, notice }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
