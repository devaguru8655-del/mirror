export const questions = [
  // Social Conflicts (1-6)
  {
    id: 1,
    category: "social",
    question: "You're at a restaurant and the waiter brings you the wrong order. It's not a big deal - the food is still edible. What do you do?",
    options: [
      { id: "A", text: "Say nothing and eat it", traits: { social_behavior: "passive", confidence_level: "low" } },
      { id: "B", text: "Politely point out the mistake", traits: { social_behavior: "direct", confidence_level: "medium" } },
      { id: "C", text: "Make a light joke about it", traits: { social_behavior: "playful", confidence_level: "high" } },
      { id: "D", text: "Ask to change it, but feel awkward", traits: { social_behavior: "hesitant", confidence_level: "low" } }
    ]
  },
  {
    id: 2,
    category: "social",
    question: "A friend cancels plans you were looking forward to - for the third time this month. How do you react?",
    options: [
      { id: "A", text: "No problem, reschedule again", traits: { emotional_response: "calm", social_behavior: "accommodating" } },
      { id: "B", text: "Tell them you're a bit disappointed", traits: { emotional_response: "honest", social_behavior: "direct" } },
      { id: "C", text: "Joke about it - 'busy life huh?'", traits: { emotional_response: "deflecting", social_behavior: "playful" } },
      { id: "D", text: "Stop making plans with them", traits: { emotional_response: "distant", social_behavior: "protective" } }
    ]
  },
  {
    id: 3,
    category: "social",
    question: "Someone cuts in front of you in a queue. No one else seems to notice. What's your move?",
    options: [
      { id: "A", text: "Let it go - not worth it", traits: { risk_level: "low", social_behavior: "passive" } },
      { id: "B", text: "Politely say 'excuse me, the line is here'", traits: { risk_level: "medium", social_behavior: "direct" } },
      { id: "C", text: "Loudly say 'hey, we all waiting here'", traits: { risk_level: "high", social_behavior: "assertive" } },
      { id: "D", text: "Give them a look but say nothing", traits: { risk_level: "low", social_behavior: "nonverbal" } }
    ]
  },
  {
    id: 4,
    category: "social",
    question: "A group of friends are deciding where to eat, and they keep going in circles. What do you do?",
    options: [
      { id: "A", text: "Suggest your favorite place", traits: { decision_style: "decisive", confidence_level: "high" } },
      { id: "B", text: "Go along with whatever they choose", traits: { decision_style: "flexible", social_behavior: "accommodating" } },
      { id: "C", text: "Make a quick list and vote", traits: { decision_style: "structured", social_behavior: "organizer" } },
      { id: "D", text: "Get frustrated internally", traits: { decision_style: "frustrated", emotional_response: "impatient" } }
    ]
  },
  {
    id: 5,
    category: "social",
    question: "Someone you barely know asks for a big favor - borrowing a significant amount of money. Your response?",
    options: [
      { id: "A", text: "Sorry, can't help this time", traits: { risk_level: "low", social_behavior: "boundary" } },
      { id: "B", text: "Offer a smaller amount", traits: { risk_level: "medium", social_behavior: "compassionate" } },
      { id: "C", text: "Ask what it's for first", traits: { risk_level: "medium", decision_style: "cautious" } },
      { id: "D", text: "Sure, when do you need it?", traits: { risk_level: "high", social_behavior: "generous" } }
    ]
  },
  {
    id: 6,
    category: "social",
    question: "You're at a party where you barely know anyone. How do you handle it?",
    options: [
      { id: "A", text: "Stick to one person and introvert", traits: { social_behavior: "introvert", confidence_level: "low" } },
      { id: "B", text: "Mingle and introduce yourself", traits: { social_behavior: "extrovert", confidence_level: "high" } },
      { id: "C", text: "Find a corner and observe", traits: { social_behavior: "observer", confidence_level: "medium" } },
      { id: "D", text: "Leave early - not your scene", traits: { social_behavior: "selective", confidence_level: "medium" } }
    ]
  },

  // Moral Dilemmas (7-12)
  {
    id: 7,
    category: "moral",
    question: "You find a wallet full of cash on the street with no ID. Nobody saw you. What do you do?",
    options: [
      { id: "A", text: "Keep it - finders keepers", traits: { risk_level: "high", moral_alignment: "selfish" } },
      { id: "B", text: "Turn it in to the police", traits: { risk_level: "low", moral_alignment: "honest" } },
      { id: "C", text: "Keep the cash, toss the wallet", traits: { risk_level: "medium", moral_alignment: "rational" } },
      { id: "D", text: "Leave it where it is", traits: { risk_level: "low", moral_alignment: "neutral" } }
    ]
  },
  {
    id: 8,
    category: "moral",
    question: "Your colleague takes credit for your work in front of the boss. What's your reaction?",
    options: [
      { id: "A", text: "Stay quiet to avoid conflict", traits: { social_behavior: "passive", emotional_response: "suppressing" } },
      { id: "B", text: "Speak up politely in the moment", traits: { social_behavior: "direct", confidence_level: "high" } },
      { id: "C", text: "Talk to them privately after", traits: { social_behavior: "diplomatic", decision_style: "indirect" } },
      { id: "D", text: "Go to HR immediately", traits: { social_behavior: "protocol", risk_level: "high" } }
    ]
  },
  {
    id: 9,
    category: "moral",
    question: "You notice a coworker is slacking off, and it's starting to affect the team. What do you do?",
    options: [
      { id: "A", text: "Mind your own business", traits: { social_behavior: "boundary", risk_level: "low" } },
      { id: "B", text: "Talk to them directly first", traits: { social_behavior: "direct", decision_style: " upfront" } },
      { id: "C", text: "Mention it to the manager", traits: { social_behavior: "protocol", risk_level: "medium" } },
      { id: "D", text: "Cover for them quietly", traits: { social_behavior: "loyal", emotional_response: "supportive" } }
    ]
  },
  {
    id: 10,
    category: "moral",
    question: "You're given too much change at a store. The cashier is busy. What do you do?",
    options: [
      { id: "A", text: "Walk out - their mistake", traits: { risk_level: "medium", moral_alignment: "opportunistic" } },
      { id: "B", text: "Return it immediately", traits: { risk_level: "low", moral_alignment: "honest" } },
      { id: "C", text: "Keep it but feel guilty", traits: { risk_level: "low", moral_alignment: "conflicted" } },
      { id: "D", text: "Leave without checking", traits: { risk_level: "low", moral_alignment: "unaware" } }
    ]
  },
  {
    id: 11,
    category: "moral",
    question: "You witness someone littering in a clean public space. How do you respond?",
    options: [
      { id: "A", text: "Say nothing - not my problem", traits: { social_behavior: "boundary", risk_level: "low" } },
      { id: "B", text: "Pick it up silently", traits: { social_behavior: "action-oriented", moral_alignment: "responsible" } },
      { id: "C", text: "Politely ask them to bin it", traits: { social_behavior: "direct", confidence_level: "medium" } },
      { id: "D", text: "Make a loud comment about it", traits: { social_behavior: "assertive", risk_level: "high" } }
    ]
  },
  {
    id: 12,
    category: "moral",
    question: "Your best friend asks you to lie for them to their partner. What's your call?",
    options: [
      { id: "A", text: "Do it - loyalty first", traits: { social_behavior: "loyal", moral_alignment: "biased" } },
      { id: "B", text: "Refuse and explain why", traits: { social_behavior: "direct", moral_alignment: "honest" } },
      { id: "C", text: "Suggest they come clean instead", traits: { social_behavior: "advisor", decision_style: "solution" } },
      { id: "D", text: "Pretend you forgot", traits: { social_behavior: "avoidant", moral_alignment: "passive" } }
    ]
  },

  // Risk Scenarios (13-18)
  {
    id: 13,
    category: "risk",
    question: "An investment opportunity comes up - high returns, but you don't fully understand it. What do you do?",
    options: [
      { id: "A", text: "Jump in - potential is worth it", traits: { risk_level: "high", decision_style: "impulsive" } },
      { id: "B", text: "Research thoroughly first", traits: { risk_level: "low", decision_style: "analytical" } },
      { id: "C", text: "Put in a small amount to test", traits: { risk_level: "medium", decision_style: "calculated" } },
      { id: "D", text: "No way - too risky", traits: { risk_level: "low", decision_style: "cautious" } }
    ]
  },
  {
    id: 14,
    category: "risk",
    question: "You're offered a job in a new city - better pay, but no guarantee you'll like it there. Take it?",
    options: [
      { id: "A", text: "Take the risk - new adventure!", traits: { risk_level: "high", emotional_response: "excited" } },
      { id: "B", text: "Visit the city first", traits: { risk_level: "medium", decision_style: "cautious" } },
      { id: "C", text: "Negotiate remote option", traits: { risk_level: "medium", decision_style: "negotiator" } },
      { id: "D", text: "Decline - staying put", traits: { risk_level: "low", social_behavior: "stable" } }
    ]
  },
  {
    id: 15,
    category: "risk",
    question: "Your friend wants to start a business with you - exciting idea, but you both have limited experience. Your view?",
    options: [
      { id: "A", text: "Go for it - learn as we go", traits: { risk_level: "high", decision_style: "optimistic" } },
      { id: "B", text: "Create a solid plan first", traits: { risk_level: "medium", decision_style: "structured" } },
      { id: "C", text: "Start as a side hustle", traits: { risk_level: "medium", decision_style: "balanced" } },
      { id: "D", text: "Too risky - just friends", traits: { risk_level: "low", decision_style: "cautious" } }
    ]
  },
  {
    id: 16,
    category: "risk",
    question: "You're at a casino for the first time. Someone offers to show you the 'winning strategy'. How do you respond?",
    options: [
      { id: "A", text: "Follow their advice", traits: { risk_level: "high", trust_level: "high" } },
      { id: "B", text: "Play only with set budget", traits: { risk_level: "medium", decision_style: "controlled" } },
      { id: "C", text: "Thank them but play solo", traits: { risk_level: "medium", social_behavior: "independent" } },
      { id: "D", text: "Leave immediately", traits: { risk_level: "low", decision_style: "cautious" } }
    ]
  },
  {
    id: 17,
    category: "risk",
    question: "A last-minute trip deal comes up - cheap, but you have prior commitments. What do you do?",
    options: [
      { id: "A", text: "Cancel and go - deals rare!", traits: { risk_level: "high", emotional_response: "spontaneous" } },
      { id: "B", text: "Stick to original plans", traits: { risk_level: "low", social_behavior: "responsible" } },
      { id: "C", text: "Check if can move commitments", traits: { risk_level: "medium", decision_style: "flexible" } },
      { id: "D", text: "Feel bad either way", traits: { emotional_response: "conflicted", social_behavior: "careful" } }
    ]
  },
  {
    id: 18,
    category: "risk",
    question: "You're asked to speak at an event with no prep time. The topic is your expertise. Accept?",
    options: [
      { id: "A", text: "Yes - I've got this", traits: { risk_level: "medium", confidence_level: "high" } },
      { id: "B", text: "Need a quick outline first", traits: { risk_level: "medium", decision_style: "prepared" } },
      { id: "C", text: "Suggest someone else", traits: { risk_level: "low", social_behavior: "humble" } },
      { id: "D", text: "No way - too stressful", traits: { risk_level: "low", confidence_level: "low" } }
    ]
  },

  // Emotional Triggers (19-24)
  {
    id: 19,
    category: "emotional",
    question: "You get constructive criticism on something you worked hard on. How do you process it?",
    options: [
      { id: "A", text: "Take it personally", traits: { emotional_response: "sensitive", social_behavior: "internalize" } },
      { id: "B", text: "Appreciate the feedback", traits: { emotional_response: "growth", decision_style: "open" } },
      { id: "C", text: "Defend your work first", traits: { emotional_response: "defensive", confidence_level: "high" } },
      { id: "D", text: "Ask clarifying questions", traits: { emotional_response: "analytical", decision_style: "curious" } }
    ]
  },
  {
    id: 20,
    category: "emotional",
    question: "Someone ghosts you after a promising first date. Your internal reaction?",
    options: [
      { id: "A", text: "Overthink everything", traits: { emotional_response: "anxious", social_behavior: "internalize" } },
      { id: "B", text: "Shrug it off - their loss", traits: { emotional_response: "resilient", confidence_level: "high" } },
      { id: "C", text: "Send a check-in text", traits: { social_behavior: "direct", emotional_response: "hopeful" } },
      { id: "D", text: "Move on immediately", traits: { emotional_response: "pragmatic", social_behavior: "practical" } }
    ]
  },
  {
    id: 21,
    category: "emotional",
    question: "You're stuck in traffic and will definitely be late for an important meeting. How do you feel?",
    options: [
      { id: "A", text: "Panic and stress out", traits: { emotional_response: "anxious", risk_level: "high" } },
      { id: "B", text: "Call and inform them", traits: { social_behavior: "proactive", decision_style: "solution" } },
      { id: "C", text: "Accept it - can't control", traits: { emotional_response: "calm", risk_level: "low" } },
      { id: "D", text: "Look for alternate routes", traits: { decision_style: "problem-solver", risk_level: "medium" } }
    ]
  },
  {
    id: 22,
    category: "emotional",
    question: "You accidentally send an angry text to the wrong person. What happens next?",
    options: [
      { id: "A", text: "Panic and delete everything", traits: { emotional_response: "anxious", risk_level: "high" } },
      { id: "B", text: "Apologize immediately", traits: { social_behavior: "accountable", moral_alignment: "responsible" } },
      { id: "C", text: "Play it cool like nothing", traits: { emotional_response: "deflecting", social_behavior: "casual" } },
      { id: "D", text: "Send another text explaining", traits: { social_behavior: "transparent", decision_style: "honest" } }
    ]
  },
  {
    id: 23,
    category: "emotional",
    question: "Your close friend moves to another city. How do you handle the goodbye?",
    options: [
      { id: "A", text: "Cry and make a scene", traits: { emotional_response: "expressive", social_behavior: "open" } },
      { id: "B", text: "Stay strong - keep it light", traits: { emotional_response: "controlled", social_behavior: "protective" } },
      { id: "C", text: "Promise to visit soon", traits: { social_behavior: "optimistic", decision_style: "forward" } },
      { id: "D", text: "Don't make it a big deal", traits: { emotional_response: "practical", social_behavior: "matter-of-fact" } }
    ]
  },
  {
    id: 24,
    category: "emotional",
    question: "You lose something really important. First feeling?",
    options: [
      { id: "A", text: "Devastated - can't think", traits: { emotional_response: "overwhelmed", risk_level: "high" } },
      { id: "B", text: "Search systematically", traits: { decision_style: "analytical", emotional_response: "problem-solver" } },
      { id: "C", text: "Accept and move on", traits: { emotional_response: "resilient", risk_level: "low" } },
      { id: "D", text: "Feel stupid / angry at self", traits: { emotional_response: "self-critical", confidence_level: "low" } }
    ]
  },

  // Decision Making (25-30)
  {
    id: 25,
    category: "decision",
    question: "You're buying a phone and there are too many options. How do you choose?",
    options: [
      { id: "A", text: "Go with the most popular", traits: { decision_style: "social-proof", social_behavior: "follower" } },
      { id: "B", text: "Make a pro-con list", traits: { decision_style: "analytical", risk_level: "low" } },
      { id: "C", text: "Trust your gut feeling", traits: { decision_style: "intuitive", confidence_level: "high" } },
      { id: "D", text: "Ask a friend for help", traits: { decision_style: "collaborative", social_behavior: "dependent" } }
    ]
  },
  {
    id: 26,
    category: "decision",
    question: "You're torn between two job offers - one pays more, one is more interesting. What wins?",
    options: [
      { id: "A", text: "Money - pays the bills", traits: { decision_style: "practical", risk_level: "low" } },
      { id: "B", text: "Passion - happiness matters", traits: { decision_style: "idealistic", emotional_response: "growth" } },
      { id: "C", text: "Negotiate both sides", traits: { decision_style: "negotiator", risk_level: "medium" } },
      { id: "D", text: "Ask mentors for advice", traits: { decision_style: "consultant", social_behavior: "advisor-seeker" } }
    ]
  },
  {
    id: 27,
    category: "decision",
    question: "Your favorite team is playing in the final, but you have an exam the next day. What do you do?",
    options: [
      { id: "A", text: "Watch the match - no regrets!", traits: { decision_style: "present-focused", emotional_response: "spontaneous" } },
      { id: "B", text: "Record and study first", traits: { decision_style: "controlled", risk_level: "low" } },
      { id: "C", text: "Study with match on side", traits: { decision_style: "multitasker", risk_level: "medium" } },
      { id: "D", text: "Sleep early - priorities", traits: { decision_style: "disciplined", risk_level: "low" } }
    ]
  },
  {
    id: 28,
    category: "decision",
    question: "You have one free weekend. Do you:",
    options: [
      { id: "A", text: "Hang with friends", traits: { social_behavior: "extrovert", emotional_response: "social" } },
      { id: "B", text: "Stay home and recharge", traits: { social_behavior: "introvert", emotional_response: "self-care" } },
      { id: "C", text: "Work on personal project", traits: { decision_style: "driven", risk_level: "medium" } },
      { id: "D", text: "Try something new", traits: { emotional_response: "adventurous", risk_level: "high" } }
    ]
  },
  {
    id: 29,
    category: "decision",
    question: "You're ordering food and you see a new dish you've never tried. What's your call?",
    options: [
      { id: "A", text: "Try it - new experiences!", traits: { decision_style: "adventurous", risk_level: "medium" } },
      { id: "B", text: "Get your usual instead", traits: { decision_style: "safe", risk_level: "low" } },
      { id: "C", text: "Ask waiter about it", traits: { decision_style: "curious", social_behavior: "inquirer" } },
      { id: "D", text: "Share with someone", traits: { decision_style: "social", social_behavior: "collaborative" } }
    ]
  },
  {
    id: 30,
    category: "decision",
    question: "You're planning a surprise for someone's birthday. How do you approach it?",
    options: [
      { id: "A", text: "Go big or go home", traits: { decision_style: "extravagant", risk_level: "high" } },
      { id: "B", text: "Keep it simple but thoughtful", traits: { decision_style: "thoughtful", emotional_response: "caring" } },
      { id: "C", text: "Ask what they want", traits: { social_behavior: "practical", decision_style: "direct" } },
      { id: "D", text: "Coordinate with friends", traits: { social_behavior: "organizer", decision_style: "team-player" } }
    ]
  }
];

export const calculateTraits = (answers) => {
  const traitCounts = {
    risk_level: { high: 0, medium: 0, low: 0 },
    emotional_response: { anxious: 0, calm: 0, expressive: 0, resilient: 0, conflicted: 0, growth: 0 },
    decision_style: { impulsive: 0, analytical: 0, intuitive: 0, cautious: 0, practical: 0 },
    social_behavior: { direct: 0, passive: 0, playful: 0, assertive: 0, accommodating: 0 },
    confidence_level: { high: 0, medium: 0, low: 0 },
    moral_alignment: { honest: 0, selfish: 0, neutral: 0, biased: 0 }
  };

  answers.forEach((answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    const selectedOption = question.options.find(o => o.id === answer.answer);
    
    if (selectedOption && selectedOption.traits) {
      Object.entries(selectedOption.traits).forEach(([trait, value]) => {
        if (traitCounts[trait]) {
          traitCounts[trait][value] = (traitCounts[trait][value] || 0) + 1;
        }
      });
    }
  });

  const dominantTraits = {};
  Object.entries(traitCounts).forEach(([trait, values]) => {
    const maxValue = Math.max(...Object.values(values));
    if (maxValue > 0) {
      const dominant = Object.entries(values).find(([_, v]) => v === maxValue)?.[0];
      dominantTraits[trait] = dominant;
    }
  });

  return dominantTraits;
};

export const generateResponse = (userMessage, traits, chatHistory) => {
  const responses = {
    risk_level: {
      high: ["Idhu konjam risky da... but worth irundha try pannalam.", "Let's just go for it!", "No time like the present - let's do this!"],
      medium: "Hmm, could work. Let's think about it properly.",
      low: "Better be careful here... not rushing into anything."
    },
    emotional_response: {
      anxious: "Okay okay, let's not panic. We'll figure this out.",
      calm: "Alright, let's keep a clear head here.",
      expressive: "I feel you! That's totally valid.",
      resilient: "Aiyyo, no problem. We'll bounce back!",
      growth: "This is actually a learning opportunity, right?"
    },
    decision_style: {
      impulsive: "Just do it! What's the worst that could happen?",
      analytical: "Let me break this down properly...",
      intuitive: "My gut says this is the right call.",
      cautious: "Let's not rush. Think step by step.",
      practical: "What makes the most sense logically?"
    },
    social_behavior: {
      direct: "I'll just say it how it is.",
      playful: "Aiyyo serially! 😂",
      assertive: "No, listen to me properly.",
      accommodating: "Whatever works for everyone, I'm good."
    },
    confidence_level: {
      high: "I'm pretty sure about this.",
      medium: "I think this is right, but not 100% certain.",
      low: "I'm not entirely sure honestly..."
    }
  };

  return `Based on your profile: ${JSON.stringify(traits)} - "${userMessage}"`;
};