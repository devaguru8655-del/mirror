import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Landing from './components/Landing';
import Interview from './components/Interview';
import Results from './components/Results';
import Chat from './components/Chat';

function App() {
  const [personaData, setPersonaData] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem('personaData');
    const savedName = localStorage.getItem('userName');
    if (savedData) setPersonaData(JSON.parse(savedData));
    if (savedName) setUserName(savedName);
  }, []);

  const savePersonaData = (data) => {
    setPersonaData(data);
    localStorage.setItem('personaData', JSON.stringify(data));
  };

  const saveUserName = (name) => {
    setUserName(name);
    localStorage.setItem('userName', name);
  };

  return (
    <Router>
      <div className="min-h-screen py-6 px-4">
        <Routes>
          <Route path="/" element={<Landing userName={userName} setUserName={saveUserName} />} />
          <Route path="/interview" element={<Interview onComplete={savePersonaData} userName={userName} />} />
          <Route path="/results" element={<Results personaData={personaData} />} />
          <Route path="/chat" element={<Chat personaData={personaData} userName={userName} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;