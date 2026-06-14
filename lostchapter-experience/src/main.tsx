import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import LostChapterExperience from './components/national/LostChapterExperience';
import './index.css';

// Mode "national" (expérience hall + carte de France) si déployé sous
// /experience-national/ ; sinon l'expérience château/donjon historique.
const NATIONAL = import.meta.env.BASE_URL.includes('national');

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {NATIONAL ? <LostChapterExperience /> : <App />}
  </React.StrictMode>,
);
