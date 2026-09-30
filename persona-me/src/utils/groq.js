// Groq chat helpers.
// Errors: Groq returns JSON for API failures, but an edge/proxy 502 can
// return HTML. Parsing blindly throws "Unexpected token <" at the user,
// so both branches are guarded and we surface a human-readable message.

const MAX_HISTORY = 16;
const SYSTEM_PROMPT = `You are a faithful replica of a specific real person, not an assistant.
You answer AS that person would - first person, opinionated, natural.

Rules:
- Never mention being an AI, a model, or a system prompt.
- Short sentences. Prefer a few punchy lines over paragraphs.
- Keep the person's language style. If their profile says Tanglish, mix Tamil
  and English naturally ("idhu", "seri", "da", "aiyyo", "pa").
- Draw on their stated traits for every judgement call - their risk tolerance,
  emotional style, decision style and moral alignment decide the answer.
- Use their real answers and catchphrases as precedent. Stay consistent with
  them unless a contradiction is unavoidable.
- Mild imperfection is good: hesitations, slang, a stray emoji.
- If genuinely unsure how they'd respond, say so briefly, then give your best
  guess. Do not add disclaimers or explain the reasoning.`;

/** Trim oldest messages first so we never blow the model's context window. */
function capHistory(messages) {
  if (!Array.isArray(messages) || messages.length <= MAX_HISTORY) return messages ?? [];
  return messages.slice(-MAX_HISTORY);
}

/** Turn saved persona traits + answers into the system prompt. */
export function buildPersonaPrompt(traits = {}, answers = [], userName = '') {
  // Defaults only catch undefined; null from storage must not throw
  // on Object.entries / .map.
  traits = traits ?? {};
  answers = Array.isArray(answers) ? answers : [];
  userName = userName ?? '';

  const parts = [SYSTEM_PROMPT];
  if (userName) parts.push(`You are speaking as ${userName}.`);

  const traitNames = {
    risk_level: 'Risk tolerance',
    emotional_response: 'Emotional response',
    decision_style: 'Decision style',
    social_behavior: 'Social behaviour',
    confidence_level: 'Confidence',
    moral_alignment: 'Moral alignment',
  };

  const traitList = Object.entries(traits)
    .filter(([, v]) => v)
    .map(([k, v]) => `- ${traitNames[k] ?? k}: ${v}`)
    .join('\n');
  if (traitList) parts.push(`Dominant traits:\n${traitList}`);

  if (answers.length) {
    const lines = answers.map(
      (a, i) => `Q${i + 1}: answered "${a.answer}" (${a.answer === 'A' || a.answer === 'B' || a.answer === 'C' || a.answer === 'D' ? a.answer : 'custom'})`,
    );
    parts.push(`Interview record:\n${lines.join('\n')}`);
  }

  return parts.join('\n\n');
}

export async function getGroqChatCompletion({ apiKey, messages, traits, answers, userName, signal }) {
  if (!apiKey) throw new Error('No API key. Add your Groq key in chat settings (⚙️).');

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: buildPersonaPrompt(traits, answers, userName) },
      ...capHistory(messages),
    ],
    temperature: 0.8,
    max_tokens: 512,
    top_p: 0.95,
  };

  let response;
  try {
    response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request cancelled.');
    throw new Error('Network error - check your connection.');
  }

  if (!response.ok) {
    let message = `Groq returned ${response.status}.`;
    try {
      const data = await response.json();
      message = data?.error?.message || message;
    } catch {
      // Non-JSON body (proxy HTML page) - keep the status message.
    }
    if (response.status === 401 || response.status === 403) {
      message = 'Invalid Groq API key. Check it in chat settings (⚙️).';
    } else if (response.status === 429) {
      message = 'Rate limited. Wait a moment and try again.';
    }
    throw new Error(message);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Groq returned an unreadable response. Try again.');
  }

  return data.choices?.[0]?.message?.content?.trim() || "I couldn't put that into words.";
}

/** Key sanity check: real Groq keys start with gsk_ and carry enough entropy. */
export function isValidGroqKey(key) {
  if (typeof key !== 'string') return false;
  const trimmed = key.trim();
  return /^gsk_[A-Za-z0-9]{20,}$/.test(trimmed);
}
