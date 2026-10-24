export async function api(path, method = 'GET', body) {
  const token = localStorage.getItem('token')
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json'
  const response = await fetch(`/api${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  })
  let data
  try {
    data = await response.json()
  } catch (error) {
    throw new Error('Cannot reach the backend. Start it on port 4000 and try again.')
  }
  if (!response.ok) throw new Error(data.error || data.message || 'Request failed')
  return data
}
