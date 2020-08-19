import { completeLogin } from 'auth/spotify'
import Nav from 'components/nav'
import Head from 'next/head'
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

  return (
    <div>
      <Head>
        <title>Logging you in...</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Nav title="SWR Spotify Example Dashboard" />

      <main className="p-2 flex flex-col max-w-xs mx-auto my-4 text-center space-y-4">
        <h1 className="text-4xl text-gray-600 animate-pulse">
          Logging you in...
        </h1>
      </main>
    </div>
  )
}
