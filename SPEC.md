# Persona Replication Engine - Website Specification

## Project Overview
- **Name**: PersonaMe
- **Type**: Web Application (React + Tailwind)
- **Core Functionality**: Interview-based personality builder that creates AI replicas of users
- **Target Users**: Anyone wanting a personal AI assistant that thinks and speaks like them

---

## UI/UX Specification

### Design Language
- **Style**: Glassmorphism UI
- **Background**: Soft gradient (lavender → soft white)
- **Cards**: Frosted glass with backdrop-blur, subtle white borders
- **Shadows**: Soft, diffused shadows

### Color Palette
```
--bg-gradient: linear-gradient(135deg, #E8DDFF 0%, #F5F5F5 50%, #E8F4FF 100%)
--glass-bg: rgba(255, 255, 255, 0.25)
--glass-border: rgba(255, 255, 255, 0.4)
--text-primary: #2D3748
--text-secondary: #4A5568
--accent: #8B5CF6 (purple)
--accent-hover: #7C3AED
```

### Typography
- **Font**: "Outfit" (Google Fonts) - modern, clean
- **Headings**: 600 weight
- **Body**: 400 weight

---

## Pages & Components

### 1. Landing Page
- Hero section with app title
- "Start Building Your Persona" button
- Brief explanation

### 2. Interview Mode (30 Questions)
- Progress bar (30 steps)
- Question card with glassmorphism
- 4 options per question (A/B/C/D)
- Smooth fade-in animations
- Progress indicator

### 3. Results Page
- Persona profile summary
- Dominant traits displayed
- "Start Chatting" button

### 4. Chat Interface (Replica Mode)
- Chat bubbles (user style match)
- Input area with send button
- Typing indicator
- Persona's response based on stored profile

---

## Functionality Specification

### Data Structure
```javascript
{
  answers: [], // user's answers
  traits: {
    risk_level: "",
    emotional_response: "",
    decision_style: "",
    social_behavior: "",
    confidence_level: ""
  },
  linguistic_style: {
    formal/casual/slang: "",
    common_phrases: [],
    language: "en/tanglish" // default english
  }
}
```

### Question Categories (30 total)
1. Social conflicts (6 questions)
2. Moral dilemmas (6 questions)
3. Risk scenarios (6 questions)
4. Emotional triggers (6 questions)
5. Decision making (6 questions)

### State Management
- Store answers in React state (localStorage for persistence)
- Calculate traits after all 30 questions
- Build persona profile from answers

---

## Acceptance Criteria
- [ ] Landing page loads with glassmorphism design
- [ ] 30 questions display one at a time
- [ ] Progress bar updates correctly
- [ ] Answers are stored and persisted
- [ ] Results page shows calculated persona
- [ ] Chat interface allows conversation with persona
- [ ] Responsive on mobile and desktop
- [ ] Smooth animations throughout