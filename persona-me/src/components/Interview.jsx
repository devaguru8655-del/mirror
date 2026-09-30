import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions, calculateTraits } from '../data/questions';
import { speak, createRecognition, matchAnswer, sttSupported, ttsSupported } from '../utils/speech';
import { safeGet, safeSet, safeRemove } from '../utils/storage';

const STORAGE_KEY = 'interviewProgress';

// Restore in-progress answers so a refresh doesn't nuke progress.
function loadProgress() {
  const saved = safeGet(STORAGE_KEY);
  if (!saved || !Array.isArray(saved.answers)) return { currentQ: 0, answers: [] };
  return {
    currentQ: Number.isInteger(saved.currentQ) ? saved.currentQ : 0,
    answers: saved.answers,
  };
}

export default function Interview({ onComplete }) {
  const initial = useRef(loadProgress()).current;
  const [currentQ, setCurrentQ] = useState(initial.currentQ);
  const [answers, setAnswers] = useState(initial.answers);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  const recognitionRef = useRef(null);
  // Voice answers read from a ref, not state. Reading `transcript` inside
  // the onend handler always saw the first-render value (empty string),
  // which silently swallowed every spoken answer.
  const transcriptRef = useRef('');
  const navigate = useNavigate();

  // Persist progress so a reload resumes instead of restarting.
  useEffect(() => {
    safeSet(STORAGE_KEY, { currentQ, answers });
  }, [currentQ, answers]);

  // Speak the question whenever it changes - previously only question 1
  // was ever read aloud, because the effect was gated on currentQ === 0.
  useEffect(() => {
    const question = questions[currentQ];
    if (!question || !ttsSupported) return;
    setTranscript('');
    transcriptRef.current = '';
    const stop = speak(`Question ${currentQ + 1}. ${question.question}`, {
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
    });
    return stop;
  }, [currentQ]);

  const handleAnswer = useCallback(
    (option) => {
      const questionId = questions[currentQ].id;
      // Replace rather than append: answering a revisited question
      // used to add a duplicate and double-count that trait.
      const next = [
        ...answers.filter((a) => a.questionId !== questionId),
        { questionId, answer: option },
      ].sort((a, b) => a.questionId - b.questionId);
      setAnswers(next);

      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
      } else {
        safeRemove(STORAGE_KEY);
        onComplete({ answers: next, traits: calculateTraits(next), timestamp: Date.now() });
        navigate('/results');
      }
    },
    [answers, currentQ, onComplete, navigate],
  );

  const handleVoiceAnswer = useCallback(
    (text) => {
      const option = matchAnswer(text, questions[currentQ].options);
      if (option) {
        setVoiceError('');
        handleAnswer(option);
      } else {
        setVoiceError("Couldn't catch that - try again, or tap an option.");
      }
    },
    [currentQ, handleAnswer],
  );

  const startListening = useCallback(() => {
    if (isListening || speaking) return;
    setVoiceError('');
    setTranscript('');
    transcriptRef.current = '';

    const recognition = createRecognition({
      onTranscript: (text) => {
        transcriptRef.current = text;
        setTranscript(text);
      },
      onEnd: () => {
        setIsListening(false);
        // Fires with the latest transcript, not a captured render value.
        handleVoiceAnswer(transcriptRef.current);
      },
      onError: (code) => {
        setIsListening(false);
        setVoiceError(
          code === 'not-allowed'
            ? 'Microphone permission was blocked. Check browser settings.'
            : code === 'no-speech'
              ? 'No speech detected. Try again.'
              : 'Voice input failed. Tap an option instead.',
        );
      },
    });

    if (!recognition) {
      setVoiceError('Voice input is not supported in this browser.');
      return;
    }

    recognitionRef.current = recognition;
    setIsListening(true);
    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceError('Could not start listening. Tap an option instead.');
    }
  }, [isListening, speaking, handleVoiceAnswer]);

  // Stop any live recognition when the component unmounts.
  useEffect(
    () => () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        /* already stopped */
      }
    },
    [],
  );

  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;
  const answered = answers.some((a) => a.questionId === question.id);

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
          />
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-8 mb-6 slide-up" key={currentQ}>
          <p className="text-xs uppercase tracking-wider text-[#8B5CF6] mb-2">
            {question.category}
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-[#2D3748] mb-6 leading-relaxed">
            {question.question}
          </h2>

          <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
            <button
              onClick={startListening}
              disabled={isListening || speaking || !sttSupported}
              className={`flex items-center gap-2 px-4 py-2 rounded-full glass-button text-white text-sm ${
                isListening || speaking || !sttSupported ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
              {isListening ? 'Listening...' : 'Voice Answer'}
            </button>

            {speaking && (
              <div className="voice-wave px-3 py-2 rounded-full bg-[#8B5CF6]/20" aria-label="Speaking">
                <div className="voice-bar" />
                <div className="voice-bar" />
                <div className="voice-bar" />
                <div className="voice-bar" />
                <div className="voice-bar" />
              </div>
            )}
          </div>

          {isListening && transcript && (
            <p className="text-center text-sm text-[#8B5CF6] mb-4 animate-pulse">
              🎤 "{transcript}"
            </p>
          )}
          {voiceError && (
            <p className="text-center text-sm text-red-500 mb-4" role="alert">
              {voiceError}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option) => {
              const selected = answered && answers.find((a) => a.questionId === question.id)?.answer === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  aria-pressed={selected}
                  className={`option-card p-4 rounded-xl text-left hover:scale-[1.02] transition-transform ${
                    selected ? 'selected' : ''
                  }`}
                >
                  <span className="inline-block w-8 h-8 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold text-sm flex items-center justify-center mr-3">
                    {option.id}
                  </span>
                  <span className="text-[#2D3748]">{option.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <button
            onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
            className="text-[#8B5CF6] hover:underline disabled:opacity-40"
            disabled={currentQ === 0}
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentQ((q) => Math.min(questions.length - 1, q + 1))}
            className="text-[#8B5CF6] hover:underline disabled:opacity-40"
            disabled={currentQ >= questions.length - 1}
          >
            Skip →
          </button>
        </div>
      </div>
    </div>
  );
}
