import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing({ userName, setUserName }) {
  const [name, setName] = useState(userName || '');
  const navigate = useNavigate();

  const handleStart = () => {
    if (name.trim()) {
      setUserName(name.trim());
      navigate('/interview');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-8 md:p-12 max-w-lg w-full slide-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent mb-2">
            PersonaMe
          </h1>
          <p className="text-[#4A5568] text-lg">
            Build your AI replica
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#2D3748] mb-2">
              What's your name?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="glass-input w-full px-5 py-4 rounded-xl text-lg outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
          </div>

          <button
            onClick={handleStart}
            disabled={!name.trim()}
            className={`glass-button w-full py-4 rounded-xl text-white font-semibold text-lg ${
              !name.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Start Building Your Persona
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-[#8B5CF6]/20">
          <p className="text-sm text-[#4A5568] text-center">
            30 questions • 5 minutes • Your AI responds like YOU
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-[#8B5CF6]/40"></div>
        <div className="w-2 h-2 rounded-full bg-[#8B5CF6]/40"></div>
        <div className="w-2 h-2 rounded-full bg-[#8B5CF6]/40"></div>
      </div>
    </div>
  );
}