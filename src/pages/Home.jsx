import { Link } from 'react-router-dom';

export default function Home({ user }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-purple-800 mb-6 leading-tight">
          Connect. Create. Collaborate.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          <strong>ARTCOL</strong> is the platform for artists to meet, share their work,
          and build amazing projects together. Whether you paint, sculpt, design, or perform —
          your community is here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-purple-700 text-white font-bold px-8 py-3 rounded-full text-lg hover:bg-purple-800 transition shadow-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-purple-700 text-white font-bold px-8 py-3 rounded-full text-lg hover:bg-purple-800 transition shadow-lg"
              >
                Get Started — It's Free
              </Link>
              <Link
                to="/login"
                className="bg-white text-purple-700 font-bold px-8 py-3 rounded-full text-lg hover:bg-purple-50 transition shadow border border-purple-200"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why ARTCOL?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: '🤝',
              title: 'Collaborate',
              description:
                'Find other artists who share your vision and create something extraordinary together.',
            },
            {
              icon: '🖼️',
              title: 'Showcase',
              description:
                'Display your portfolio, share your process, and get inspired by talented creators worldwide.',
            },
            {
              icon: '🌍',
              title: 'Community',
              description:
                'Join a vibrant, supportive community of artists from every discipline and background.',
            },
          ].map(({ icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition"
            >
              <div className="text-5xl mb-4">{icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA footer banner */}
      <section className="bg-purple-700 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to start your artistic journey?</h2>
        <p className="text-purple-200 mb-8 text-lg">
          Join thousands of artists already using ARTCOL.
        </p>
        {!user && (
          <Link
            to="/login"
            className="bg-white text-purple-700 font-bold px-8 py-3 rounded-full text-lg hover:bg-purple-100 transition shadow-lg"
          >
            Join ARTCOL Today
          </Link>
        )}
      </section>
    </div>
  );
}
