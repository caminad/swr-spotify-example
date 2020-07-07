import useUser from 'auth/use-user'
import Nav from 'components/nav'
import Head from 'next/head'
import Router from 'next/router'
import { useEffect } from 'react'
import { logout } from 'auth/spotify'

export default function Dashboard() {
  const { user, loggedOut, mutate } = useUser()

  useEffect(() => {
    if (loggedOut) {
      mutate(null, false).then(() => Router.replace('/'))
    }
  }, [loggedOut])

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Nav title="ACME Dashboard" />
      <main>
        {user && (
          <>
            <h1>Welcome, {user.display_name}</h1>
            <p>This is your dashboard.</p>
            <button
              onClick={async () => {
                logout()
                await mutate(null) // optimistically update the data and revalidate
                Router.replace('/')
              }}
            >
              Logout
            </button>
          </>
        )}
      </main>
    </div>
  )
}
