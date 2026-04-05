# 🎨 ARTCOL

**ARTCOL** is a platform for artists to connect, showcase their work, and collaborate on creative projects.

## Tech Stack

- **Frontend**: [React](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **Backend / Auth**: [Firebase](https://firebase.google.com/) (Authentication + Firestore)
- **Routing**: [React Router v7](https://reactrouter.com/)

## Project Structure

```
src/
├── components/
│   └── Navbar.jsx         # Navigation bar with auth-aware links
├── pages/
│   ├── Home.jsx           # Landing page with call-to-action
│   ├── Login.jsx          # Sign in / Sign up with Firebase Auth
│   └── Dashboard.jsx      # Artist discovery dashboard
├── firebase.js            # Firebase app initialisation
├── App.jsx                # Root component with routing
├── main.jsx               # React entry point
└── index.css              # Global styles (Tailwind import)
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bouhleltarek06220-a11y/ARTCOL.git
cd ARTCOL
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a Firebase project at <https://console.firebase.google.com/>, enable **Email/Password** authentication, and copy your config values.

```bash
cp .env.example .env
# then edit .env with your Firebase credentials
```

### 4. Run the development server

```bash
npm run dev
```

Open <http://localhost:5173> in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Features

- 🏠 **Home page** – explains ARTCOL with a prominent call-to-action
- 🔐 **Authentication** – sign up / sign in via Firebase Email & Password
- �� **Dashboard** – artist discovery grid with dummy placeholder data
- 🔒 **Protected routes** – dashboard requires authentication
