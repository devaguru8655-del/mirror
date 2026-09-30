import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroqChatCompletion, isValidGroqKey } from '../utils/groq';
import { speak, createRecognition, sttSupported, ttsSupported } from '../utils/speech';
import { safeGet, safeSet, safeRemove } from '../utils/storage';

const API_KEY = 'groq_api_key';
const CHAT_KEY = 'chatHistory';

export default function Chat({ personaData, userName }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => safeGet(CHAT_KEY, []) ?? []);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [apiKey, setApiKey] = useState(() => safeGet(API_KEY, '') ?? '');
  const [showKeyInput, setShowKeyInput] = useState(() => !safeGet(API_KEY, ''));
  const [keyDraft, setKeyDraft] = useState('');
  const [keyError, setKeyError] = useState('');
  const [chatError, setChatError] = useState('');

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const abortRef = useRef(null);
  const synthStopRef = useRef(null);

  // No persona means no voice output - and we tell the user instead of
  // dropping them into a chat that quietly stays empty.
  const hasPersona = Boolean(personaData && personaData.traits);

  useEffect(() => {
    if (!hasPersona && messages.length === 0) return;
    safeSet(CHAT_KEY, messages);
  }, [messages, hasPersona]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Abort in-flight requests and silence TTS on unmount.
  useEffect(
    () => () => {
      abortRef.current?.abort();
      synthStopRef.current?.();
      try {
        recognitionRef.current?.abort();
      } catch {
        /* already stopped */
      }
    },
    [],
  );

  const speakResponse = useCallback((text) => {
    if (!ttsSupported) return;
    synthStopRef.current?.();
    synthStopRef.current = speak(text, {
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
    });
  }, []);

  const handleSaveKey = () => {
    const key = keyDraft.trim();
    if (!isValidGroqKey(key)) {
      setKeyError('Keys look like gsk_ followed by a long string. Check it.');
      return;
    }
    safeSet(API_KEY, key);
    setApiKey(key);
    setKeyError('');
    setShowKeyInput(false);
  };

  const startListening = () => {
    if (isListening || speaking || isTyping) return;
    setTranscript('');
    transcriptRef.current = '';

    const recognition = createRecognition({
      onTranscript: (text) => {
        transcriptRef.current = text;
        setTranscript(text);
      },
      onEnd: () => {
        setIsListening(false);
        const text = transcriptRef.current.trim();
        if (text) setInput(text);
      },
      onError: (code) => {
        setIsListening(false);
        setChatError(code === 'not-allowed' ? 'Mic permission blocked.' : 'Voice input failed.');
      },
    });

    if (!recognition) {
      setChatError('Voice input is not supported in this browser.');
      return;
    }
    recognitionRef.current = recognition;
    setIsListening(true);
    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setChatError('Could not start listening.');
    }
  };

  const handleSend = async (override) => {
    const text = (override ?? input).trim();
    if (!text || isTyping) return;
    if (!hasPersona) {
      navigate('/interview');
      return;
    }
    if (!isValidGroqKey(apiKey)) {
      setShowKeyInput(true);
      setKeyError('Add your Groq API key to start chatting.');
      return;
    }

    setInput('');
    setChatError('');
    setTranscript('');
    transcriptRef.current = '';

    const nextMessages = [...messages, { id: Date.now(), role: 'user', content: text }];
    setMessages(nextMessages);
    setIsTyping(true);

    abortRef.current = new AbortController();

    try {
      const reply = await getGroqChatCompletion({
        apiKey,
        messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        traits: personaData.traits,
        answers: personaData.answers ?? [],
        userName,
        signal: abortRef.current.signal,
      });
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply }]);
      speakResponse(reply);
    } catch (err) {
      setChatError(err.message || 'Something went wrong.');
    } finally {
      setIsTyping(false);
      abortRef.current = null;
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
            <p className="text-xs text-[#8B5CF6]">
              {hasPersona ? `Speaking as ${userName || 'you'}` : 'Persona not built yet'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyInput((v) => !v)}
            className="px-3 py-1 rounded-full text-sm text-[#8B5CF6] hover:bg-white/40"
            aria-label="Chat settings"
          >
            ⚙️
          </button>
          <button
            onClick={() => {
              setMessages([]);
              safeRemove(CHAT_KEY);
              setChatError('');
            }}
            className="px-3 py-1 rounded-full text-sm text-[#8B5CF6] hover:bg-white/40 disabled:opacity-40"
            disabled={messages.length === 0}
            aria-label="Clear chat"
          >
            🗑
          </button>
        </div>
      </div>

      {showKeyInput && (
        <div className="glass-card p-4 mx-4 mt-2 rounded-2xl">
          <p className="text-sm text-[#4A5568] mb-2">Groq API key:</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder="gsk_..."
              className="flex-1 glass-input px-3 py-2 rounded-lg text-sm outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
              aria-label="Groq API key"
            />
            <button onClick={handleSaveKey} className="px-4 py-2 rounded-lg glass-button text-white text-sm">
              Save
            </button>
          </div>
          {keyError && (
            <p className="text-red-500 text-xs mt-2" role="alert">
              {keyError}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Free key at{' '}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              console.groq.com/keys
            </a>
          </p>
        </div>
      )}

      <div className="flex-1 glass-card rounded-b-3xl p-4 flex flex-col min-h-[70vh]">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {!hasPersona ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <p className="text-[#4A5568]">Finish the 30-question interview first.</p>
              <button
                onClick={() => navigate('/interview')}
                className="px-5 py-3 rounded-xl glass-button text-white"
              >
                Start Interview
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center text-[#4A5568] px-4">
              Say hi, or ask yourself a question.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`message-bubble ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white rounded-br-md'
                      : 'bg-white/60 text-[#2D3748] rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="message-bubble bg-white/60 text-[#2D3748] rounded-bl-md flex items-center gap-2">
                <div className="voice-wave">
                  <div className="voice-bar" />
                  <div className="voice-bar" />
                  <div className="voice-bar" />
                  <div className="voice-bar" />
                  <div className="voice-bar" />
                </div>
                <span className="text-xs text-[#8B5CF6]">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {chatError && (
          <p className="text-sm text-red-500 mb-2 text-center" role="alert">
            {chatError}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={startListening}
            disabled={isListening || speaking || isTyping || !sttSupported}
            className={`p-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'glass-button text-white'} ${
              isListening || speaking || isTyping || !sttSupported ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Voice input"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={hasPersona ? 'Type or tap the mic...' : 'Finish the interview first'}
            className="flex-1 glass-input px-4 py-3 rounded-full outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping || !hasPersona}
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping || !hasPersona}
            className={`p-3 rounded-full glass-button text-white ${
              !input.trim() || isTyping || !hasPersona ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Send message"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>

        {isListening && (
          <div className="mt-2 text-center">
            <span className="text-sm text-[#8B5CF6] animate-pulse">
              🎤 {transcript || 'Listening...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
