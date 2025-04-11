import { loginWithGoogle, loginWithFacebook, logout } from '../services/firebase'

function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-3xl font-bold text-yellow-400">Login</h2>

      <button onClick={loginWithGoogle} className="bg-red-500 text-white px-4 py-2 rounded">
        Login con Google
      </button>

      <button onClick={loginWithFacebook} className="bg-blue-500 text-white px-4 py-2 rounded">
        Login con Facebook
      </button>

      <button onClick={logout} className="bg-gray-500 text-white px-4 py-2 rounded">
        Cerrar sesión
      </button>
    </div>
  )
}

export default Login
