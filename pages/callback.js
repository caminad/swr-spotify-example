import { completeLogin } from 'auth/spotify'
import useUser from 'auth/use-user'
import Router from 'next/router'
import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    completeLogin()
      .then(() => {
        Router.replace('/dashboard')
      })
      .catch((error) => {
        console.error(error)
        Router.replace('/')
      })
  }, [])

  return 'Logging you in...'
}
