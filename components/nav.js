import { beginLogin } from 'auth/spotify'
import useUser from 'auth/use-user'
import Image from 'next/image'

/**
 * @param {Object} props
 * @param {string} props.title
 */
export default function Nav(props) {
  const { user, loggedOut } = useUser()

  return (
    <nav className="p-2 flex justify-between items-center text-white bg-gradient-to-r from-purple-600 via-red-600 to-orange-600">
      <h3 className="font-bold">{props.title}</h3>
      {loggedOut && (
        <button
          className="px-2 border border-current rounded bg-white bg-opacity-0 hover:bg-opacity-25 focus:outline-none focus:shadow-outline"
          onClick={() => beginLogin()}
        >
          Login
        </button>
      )}
      {user &&
        (user.images[0]?.url ? (
          <Image
            className="w-6 h-6"
            src={user.images[0].url}
            width={32}
            alt={user.display_name}
          />
        ) : (
          <svg
            className="w-6 h-6"
            role="image"
            aria-label={user.display_name}
            viewBox="0 0 20 20"
            width={32}
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clipRule="evenodd"
            />
          </svg>
        ))}
    </nav>
  )
}
