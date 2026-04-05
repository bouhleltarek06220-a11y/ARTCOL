import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-purple-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-purple-200 transition">
          🎨 ARTCOL
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-purple-200 transition font-medium">
                Dashboard
              </Link>
              <span className="text-purple-200 text-sm hidden sm:block">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-purple-700 font-semibold px-4 py-1.5 rounded-full hover:bg-purple-100 transition text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-purple-700 font-semibold px-4 py-1.5 rounded-full hover:bg-purple-100 transition text-sm"
            >
              Login / Sign up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
