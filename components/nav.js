import { beginLogin } from 'auth/spotify'
import useUser from 'auth/use-user'

/**
 * @param {Object} props
 * @param {string} props.title
 */
export default function Nav(props) {
  const { user, loggedOut } = useUser()

  return (
    <>
      <nav>
        <h3>{props.title}</h3>
        {loggedOut && <button onClick={() => beginLogin()}>Login</button>}
        {user && (
          <img src={user.images[0]?.url} width={32} alt={user.display_name} />
        )}
      </nav>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue',
            'Helvetica', 'Arial', sans-serif;
        }
        nav {
          display: flex;
          padding: 1rem;
          height: 65px;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #999;
          box-sizing: border-box;
        }
        nav h3 {
          margin: 0;
        }
        img {
          border-radius: 50%;
        }
        main {
          padding: 1rem;
        }
        .homepage main {
          text-align: center;
        }
      `}</style>
    </>
  )
}
