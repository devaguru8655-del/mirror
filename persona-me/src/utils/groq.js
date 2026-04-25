export const getGroqChatCompletion = async (apiKey, messages, traits) => {
  const personalityContext = `
You are an AI replica of a user. Your personality traits:
- Risk level: ${traits.risk_level || 'medium'}
- Emotional response: ${traits.emotional_response || 'calm'}
- Decision style: ${traits.decision_style || 'practical'}
- Social behavior: ${traits.social_behavior || 'direct'}
- Confidence: ${traits.confidence_level || 'medium'}
- Moral alignment: ${traits.moral_alignment || 'neutral'}

Respond naturally as this person would. Use their language style - be conversational, slightly informal. Sometimes use Tamil-English mix (Tanglish) like "idhu", "seri", "aiyyo", "pa".
`;

  const systemMessage = { role: "system", content: personalityContext };
  
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [systemMessage, ...messages],
      temperature: 0.8,
      max_tokens: 512,
      top_p: 0.95
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "API Error");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
};

export const validateGroqKey = async (apiKey) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    return response.ok;
  } catch {
    return false;
  }
};