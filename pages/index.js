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

      <Nav title="SWR Spotify Example" />

      <main className="p-2 flex flex-col max-w-xs mx-auto my-4 text-center space-y-4">
        <h1 className="text-4xl">Do something cool with your Spotify data.</h1>
        <br />
        <button
          className="px-4 py-2 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 text-white font-bold hover:opacity-75 focus:outline-none focus:shadow-outline"
          onClick={async () => {
            await beginLogin()
          }}
        >
          Login with Spotify to continue
        </button>
        <p>
          <a
            className="px-4 py-2 text-blue-600 font-bold hover:underline"
            href="https://github.com/kitibyte/swr-spotify-example"
          >
            source
          </a>
        </p>
      </main>
    </div>
  )
}
