import useSWR from 'swr'
import { fetchWithToken } from 'auth/spotify'

export default function useUser() {
  const { data, mutate, error } = useSWR(
    'https://api.spotify.com/v1/me',
    fetchWithToken,
  )

  return {
    user: data,
    mutate,
    loggedOut: error?.status === 401,
  }
}
