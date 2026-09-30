// Cross-browser speech helpers: synthesis (TTS) + recognition (STT).
// Every path here must clear its own "active" flag. A latched flag would
// permanently disable the mic button, which is how these broke before.

export const ttsSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window;

export const sttSupported =
  typeof window !== 'undefined' &&
  ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

/**
 * Speak text. Returns a cleanup function.
 *
 * onStart/onEnd/onError all funnel through `finish()` so the flag is
 * cleared exactly once no matter how the utterance ends (cancel,
 * error, or reaching end of text).
 */
export function speak(text, { onStart, onEnd, rate = 0.9, lang = 'en-IN' } = {}) {
  if (!ttsSupported) return () => {};

  const synth = window.speechSynthesis;
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    onEnd?.();
  };

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.lang = lang;
  utterance.onstart = () => onStart?.();
  utterance.onend = finish;
  utterance.onerror = finish;

  // Safety net: some engines fire neither onend nor onerror reliably.
  const watchdog = window.setTimeout(finish, 30000);

  synth.cancel();
  synth.speak(utterance);

  return () => {
    window.clearTimeout(watchdog);
    try {
      synth.cancel();
    } catch {
      /* engines throw when nothing is queued */
    }
    finish();
  };
}

/**
 * One-shot recognition session. Returns null when unsupported.
 * The live transcript is passed through a ref-style callback so
 * consumers never read a stale closure value.
 */
export function createRecognition({ onTranscript, onEnd, onError }) {
  if (!sttSupported) return null;

  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new Ctor();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-IN';

  recognition.onresult = (event) => {
    const last = event.results[event.results.length - 1];
    if (!last) return;
    const text = last[0]?.transcript ?? '';
    onTranscript?.(text, last.isFinal === true);
  };

  recognition.onerror = (event) => {
    onError?.(event.error);
    onEnd?.();
  };

  recognition.onend = () => onEnd?.();

  return recognition;
}

/**
 * Map a spoken string onto one of the four option ids.
 * Matches option letters ("b", "option b"), then option text,
 * then a small synonym table. Returns null when unrecognised so
 * the caller can tell the user rather than silently dropping it.
 */
export function matchAnswer(text, options) {
  if (!text) return null;
  const lower = text.toLowerCase().trim();
  if (!lower) return null;

  // Explicit choice: "option b", "answer c", "I choose d".
  const explicit = lower.match(
    /\b(?:option|answer|choose|choice|select)\s+(?:number\s+)?([abcd])\b/,
  );
  if (explicit) return explicit[1].toUpperCase();

  // A lone letter as the whole utterance: "b", "option b".
  // Matching \b[a-d]\b anywhere would hit the English article "a"
  // ("make a joke" -> "A"), so the input must be short.
  if (lower.length <= 12) {
    const lone = lower.match(/^(?:i'?ll\s+)?(?:option\s+)?([abcd])$/);
    if (lone) return lone[1].toUpperCase();
  }

  const byText = options.find((opt) => {
    const needle = opt.text.toLowerCase();
    return needle.length > 4 && lower.includes(needle);
  });
  if (byText) return byText.id;

  const synonyms = {
    A: ['say nothing', 'do nothing', 'leave it', 'keep quiet', 'silent'],
    B: ['point out', 'tell them', 'politely', 'mention it', 'correct them'],
    C: ['joke', 'funny', 'laugh', 'lighter note', 'tease'],
    D: ['awkward', 'change it', 'ask to change', 'uncomfortable'],
  };

  for (const [id, words] of Object.entries(synonyms)) {
    if (words.some((w) => lower.includes(w))) return id;
  }

  return null;
}
