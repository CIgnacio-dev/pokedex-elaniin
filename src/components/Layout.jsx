import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from 'react-router-dom'
import { logout } from "../services/firebase";




function Layout({ children }) {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <nav className="bg-gray-800 px-4 py-3">
  <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2">
    
    <h1 className="text-xl font-bold text-white">
      <Link to="/">Pokedex</Link>
    </h1>

    <div className="flex items-center gap-4 flex-wrap">
      <Link to="/" className="hover:text-yellow-400 text-sm">
        Home
      </Link>
      <Link to="/team" className="hover:text-yellow-400 text-sm">
        Equipo
      </Link>
      <Link to="/teams" className="hover:text-yellow-400 text-sm">
        Equipos guardados
      </Link>

      {currentUser ? (
        <>
          <img src={currentUser.photoURL} alt="user" className="w-8 h-8 rounded-full" />
          <span className="text-white text-sm">{currentUser.displayName}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" className="hover:text-yellow-400 text-sm">
          Login
        </Link>
      )}
    </div>

  </div>
</nav>



      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  )
}

export default Layout
