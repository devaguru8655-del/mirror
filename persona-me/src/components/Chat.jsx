import { useState, useEffect, useRef } from 'react';
import { getGroqChatCompletion } from '../utils/groq';

export default function Chat({ personaData, userName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('groq_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(() => !localStorage.getItem('groq_api_key'));
  const [keyError, setKeyError] = useState('');
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    if (!personaData) return;
    
    setMessages([{
      id: 1,
      sender: 'ai',
      text: `Hey! I'm your AI replica. I'm built to think and respond like YOU would. Let's chat!`,
      traits: personaData.traits
    }]);

    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        setInput(result);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [personaData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakResponse = (text) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSaveKey = () => {
    if (apiKey.trim().length > 10) {
      localStorage.setItem('groq_api_key', apiKey.trim());
      setShowKeyInput(false);
      setKeyError('');
    } else {
      setKeyError('Please enter a valid Groq API key');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey && showKeyInput) {
      setShowKeyInput(true);
      return;
    }
    
    const userMsg = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const chatMessages = messages.map(msg => ({
        role: msg.sender === 'ai' ? 'assistant' : 'user',
        content: msg.text
      }));
      chatMessages.push({ role: 'user', content: userMsg });

      const aiResponse = await getGroqChatCompletion(apiKey, chatMessages, personaData.traits);
      
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponse }]);
      speakResponse(aiResponse);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: `Oops! Something went wrong: ${error.message}` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto">
      <div className="glass-card rounded-t-3xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h1 className="font-semibold text-[#2D3748]">Your AI Replica</h1>
            <p className="text-xs text-[#8B5CF6]">Powered by Groq Llama 3</p>
          </div>
        </div>
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="px-3 py-1 text-sm text-[#8B5CF6]"
        >
          ⚙️
        </button>
      </div>

      {showKeyInput && (
        <div className="glass-card p-4 mx-4 mt-2 rounded-2xl">
          <p className="text-sm text-[#4A5568] mb-2">Enter your Groq API Key:</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_..."
              className="flex-1 glass-input px-3 py-2 rounded-lg text-sm outline-none"
            />
            <button
              onClick={handleSaveKey}
              className="px-4 py-2 rounded-lg glass-button text-white text-sm"
            >
              Save
            </button>
          </div>
          {keyError && <p className="text-red-500 text-xs mt-2">{keyError}</p>}
          <p className="text-xs text-gray-500 mt-2">
            Get free key at <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="underline">console.groq.com</a>
          </p>
        </div>
      )}

      <div className="flex-1 glass-card rounded-b-3xl p-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`message-bubble ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white rounded-br-md'
                    : 'bg-white/60 text-[#2D3748] rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="message-bubble bg-white/60 text-[#2D3748] rounded-bl-md flex items-center gap-2">
                <div className="voice-wave">
                  <div className="voice-bar"></div>
                  <div className="voice-bar"></div>
                  <div className="voice-bar"></div>
                  <div className="voice-bar"></div>
                  <div className="voice-bar"></div>
                </div>
                <span className="text-xs text-[#8B5CF6]">Thinking...</span>
              </div>
            </div>
          )}
          
          {isSpeaking && (
            <div className="flex justify-start">
              <div className="message-bubble bg-white/60 text-[#2D3748] rounded-bl-md flex items-center gap-2">
                <span className="text-xs text-[#8B5CF6]">🔊 Speaking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startListening}
            disabled={isListening || isSpeaking || isTyping}
            className={`p-3 rounded-full ${
              isListening 
                ? 'bg-red-500 animate-pulse' 
                : 'glass-button text-white'
            } ${isTyping ? 'opacity-50' : ''}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 glass-input px-4 py-3 rounded-full outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`p-3 rounded-full glass-button text-white ${
              !input.trim() || isTyping ? 'opacity-50' : ''
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>

        {isListening && (
          <div className="mt-2 text-center">
            <span className="text-sm text-[#8B5CF6] animate-pulse">
              🎤 Listening: "{transcript}"
            </span>
          </div>
        )}
      </div>
    </div>
  );
}