import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions, calculateTraits } from '../data/questions';

export default function Interview({ onComplete, userName }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        handleVoiceAnswer(transcript);
      };
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (currentQ === 0) {
      speakQuestion(0);
    }
  }, [currentQ]);

  const speakQuestion = (index) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const question = questions[index];
    const text = `Question ${index + 1}. ${question.question}`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const handleVoiceAnswer = (text) => {
    const lower = text.toLowerCase().trim();
    
    if (['a', 'b', 'c', 'd'].includes(lower)) {
      handleAnswer(lower.toUpperCase());
      return;
    }
    
    const keywords = {
      A: ['nothing', 'passive', 'silent', 'quiet', 'keep'],
      B: ['polite', 'tell', 'point', 'return'],
      C: ['joke', 'funny', 'light', 'humor'],
      D: ['awkward', 'change', 'ask', 'feel']
    };
    
    for (const [option, words] of Object.entries(keywords)) {
      if (words.some(w => lower.includes(w))) {
        handleAnswer(option);
        return;
      }
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleAnswer = (option) => {
    const newAnswers = [...answers, { questionId: questions[currentQ].id, answer: option }];
    setAnswers(newAnswers);
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const traits = calculateTraits(newAnswers);
      const data = { answers: newAnswers, traits, timestamp: Date.now() };
      onComplete(data);
      navigate('/results');
    }
  };

  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-[#4A5568] font-medium">
            Question {currentQ + 1} / {questions.length}
          </span>
          <span className="text-[#8B5CF6] font-medium">{Math.round(progress)}%</span>
        </div>
        
        <div className="h-2 bg-white/30 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-full progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-8 mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2D3748] mb-6 leading-relaxed">
            {question.question}
          </h2>

          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={startListening}
              disabled={isListening || speaking}
              className={`flex items-center gap-2 px-4 py-2 rounded-full glass-button text-white text-sm ${
                isListening || speaking ? 'opacity-50' : ''
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
              {isListening ? 'Listening...' : 'Voice Answer'}
            </button>
            
            {speaking && (
              <div className="voice-wave px-3 py-2 rounded-full bg-[#8B5CF6]/20">
                <div className="voice-bar"></div>
                <div className="voice-bar"></div>
                <div className="voice-bar"></div>
                <div className="voice-bar"></div>
                <div className="voice-bar"></div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className="option-card p-4 rounded-xl text-left hover:scale-[1.02] transition-transform"
              >
                <span className="inline-block w-8 h-8 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold text-sm flex items-center justify-center mr-3">
                  {option.id}
                </span>
                <span className="text-[#2D3748]">{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              if (currentQ > 0) setCurrentQ(currentQ - 1);
            }}
            className="text-[#8B5CF6] text-sm hover:underline"
            disabled={currentQ === 0}
          >
            ← Previous Question
          </button>
        </div>
      </div>
    </div>
  );
}