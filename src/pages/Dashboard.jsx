const DUMMY_ARTISTS = [
  {
    id: 1,
    name: 'Sophie Martin',
    discipline: 'Painter',
    location: 'Paris, France',
    bio: 'Abstract expressionist exploring emotion through color and texture.',
    emoji: '🎨',
  },
  {
    id: 2,
    name: 'Carlos Rivera',
    discipline: 'Photographer',
    location: 'Mexico City, Mexico',
    bio: 'Documentary photographer capturing untold stories of urban life.',
    emoji: '📸',
  },
  {
    id: 3,
    name: 'Aisha Nkosi',
    discipline: 'Sculptor',
    location: 'Nairobi, Kenya',
    bio: 'Creating contemporary sculptures inspired by African heritage.',
    emoji: '🏺',
  },
  {
    id: 4,
    name: 'Lena Müller',
    discipline: 'Illustrator',
    location: 'Berlin, Germany',
    bio: 'Digital illustrator crafting surreal, dreamlike worlds.',
    emoji: '✏️',
  },
  {
    id: 5,
    name: 'Kenji Tanaka',
    discipline: 'Musician & Composer',
    location: 'Tokyo, Japan',
    bio: 'Blending traditional Japanese instruments with electronic music.',
    emoji: '🎵',
  },
  {
    id: 6,
    name: 'Priya Sharma',
    discipline: 'Dancer & Choreographer',
    location: 'Mumbai, India',
    bio: 'Fusing classical Bharatanatyam with contemporary movement.',
    emoji: '💃',
  },
];

export default function Dashboard({ user }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Discover and connect with talented artists from around the world.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Artists', value: '2,400+' },
            { label: 'Collaborations', value: '850+' },
            { label: 'Countries', value: '68' },
            { label: 'Disciplines', value: '30+' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl shadow p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Artist grid */}
        <h2 className="text-xl font-bold text-gray-700 mb-6">Featured Artists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_ARTISTS.map((artist) => (
            <div
              key={artist.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-3xl shrink-0">
                  {artist.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{artist.name}</h3>
                  <span className="inline-block text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1">
                    {artist.discipline}
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-3">{artist.bio}</p>
              <p className="text-xs text-gray-400">📍 {artist.location}</p>
              <button className="mt-4 w-full text-sm font-semibold text-purple-700 border border-purple-300 rounded-full py-1.5 hover:bg-purple-50 transition">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
