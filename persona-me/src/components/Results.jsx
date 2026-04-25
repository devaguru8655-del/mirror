import { useNavigate } from 'react-router-dom';

export default function Results({ personaData }) {
  const navigate = useNavigate();
  
  if (!personaData) {
    navigate('/');
    return null;
  }

  const { traits } = personaData;

  const formatTrait = (key) => {
    return key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const traitDisplay = {
    risk_level: { high: 'Risk Taker 🌶️', medium: 'Balanced', low: 'Play Safe' },
    emotional_response: { anxious: 'Gets Anxious', calm: 'Calm Head', expressive: ' expressive', resilient: 'Bounces Back', conflicted: 'Feels It All', growth: 'Growth Mindset' },
    decision_style: { impulsive: 'Act Now!', analytical: 'Analyze First', intuitive: 'Trust Gut', cautious: 'Careful', practical: 'Practical' },
    social_behavior: { direct: 'Direct', passive: 'Goes With Flow', playful: 'Fun Person', assertive: 'Speaks Up', accommodating: 'People Pleaser' },
    confidence_level: { high: 'Confident', medium: 'Balanced', low: 'Humble' },
    moral_alignment: { honest: 'Honest', selfish: 'Self-First', neutral: 'Neutral', biased: 'Loyal' }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="glass-card rounded-3xl p-6 md:p-8 slide-up">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center">
              <span className="text-4xl">🤖</span>
            </div>
            <h1 className="text-3xl font-bold text-[#2D3748] mb-2">
              Your Persona is Ready!
            </h1>
            <p className="text-[#4A5568]">
              AI replica built from your answers
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold text-[#2D3748] mb-4">
              Your Dominant Traits:
            </h2>
            
            {Object.entries(traits).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/40">
                <span className="text-[#4A5568] font-medium">
                  {formatTrait(key)}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] font-medium text-sm">
                  {traitDisplay[key]?.[value] || value}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/chat')}
            className="glass-button w-full py-4 rounded-xl text-white font-semibold text-lg"
          >
            Start Chatting with Your AI
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-3 py-3 text-[#8B5CF6] text-sm hover:underline"
          >
            Rebuild Persona
          </button>
        </div>
      </div>
    </div>
  );
}