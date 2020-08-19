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

      <Nav title="SWR Spotify Example Dashboard" />

      <main className="p-2 flex flex-col max-w-xs mx-auto my-4 text-center space-y-4">
        {user && (
          <>
            <h1 className="text-4xl">Welcome, {user.display_name}</h1>
            <p className="text-xl">This is your dashboard.</p>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold hover:opacity-75 focus:outline-none focus:shadow-outline"
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
