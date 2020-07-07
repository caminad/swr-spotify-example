import { beginLogin } from 'auth/spotify'
import useUser from 'auth/use-user'
import Nav from 'components/nav'
import Router from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const { user } = useUser()

  // if logged in, redirect to the dashboard
  useEffect(() => {
    if (user) {
      Router.replace('/dashboard')
    }
  }, [user])

  return (
    <div className="homepage">
      <Head>
        <title>Please Login</title>
      </Head>
      <Nav title="ACME" />
      <main>
        <h1>ACME!</h1>
        <p>Do something cool with your Spotify data</p>
        <br />
        <button
          onClick={async () => {
            await beginLogin()
          }}
        >
          Login with Spotify to continue
        </button>
      </main>
    </div>
  )
}
