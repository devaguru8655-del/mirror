import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './components/Landing';
import Interview from './components/Interview';
import Results from './components/Results';
import Chat from './components/Chat';
import { safeGet, safeSet } from './utils/storage';

function App() {
  const [personaData, setPersonaData] = useState(null);
  const [userName, setUserName] = useState('');

  // safeGet already swallows malformed JSON - a corrupted value can't
  // whitescreen the app on boot the way a bare JSON.parse could.
  useEffect(() => {
    setPersonaData(safeGet('personaData'));
    setUserName(safeGet('userName', ''));
  }, []);

  const savePersonaData = (data) => {
    setPersonaData(data);
    safeSet('personaData', data);
  };

  const saveUserName = (name) => {
    setUserName(name);
    safeSet('userName', name);
  };

  return (
    <Router>
      <div className="min-h-screen py-6 px-4">
        <Routes>
          <Route path="/" element={<Landing userName={userName} setUserName={saveUserName} />} />
          <Route path="/interview" element={<Interview onComplete={savePersonaData} userName={userName} />} />
          <Route path="/results" element={<Results personaData={personaData} />} />
          <Route path="/chat" element={<Chat personaData={personaData} userName={userName} />} />
          <Route path="*" element={<Landing userName={userName} setUserName={saveUserName} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
