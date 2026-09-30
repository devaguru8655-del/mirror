# PersonaMe

Build an AI replica of yourself: answer a 30-question interview, get a personality
profile, and chat with a voice-enabled AI that responds in your style.

## Stack

- React 18 + Vite 5 + Tailwind CSS 3 (glassmorphism UI)
- Groq API (`llama-3.3-70b-versatile`) for inference
- Web Speech API for voice input / output
- Node's built-in test runner for logic tests

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Tests

```bash
npm test
```

Covers the question bank, trait scoring, speech answer matching, prompt
construction, history capping, API error handling and key validation.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Groq API key

The key is entered in the chat screen (⚙️) and stored in `localStorage` only.
It is never committed, never bundled, and is sent only to `api.groq.com`.

Get a free key at https://console.groq.com/keys

## Deploy

### Cloudflare Pages

```bash
npx wrangler login
npm run build
npx wrangler pages deploy dist --project-name=personame
```

`public/_redirects` rewrites all paths to `index.html` so client-side routes
like `/chat` work on a direct load.

### GitHub

```bash
git remote set-url origin https://github.com/<you>/mirror.git
git push
```

CI (`.github/workflows/ci.yml`) builds on every push and deploys `main` to
Cloudflare Pages when these repository secrets are set:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Project layout

```
src/
  components/   Landing, Interview, Results, Chat
  data/         questions.js - 30 questions + trait scoring
  utils/
    groq.js     API client, persona prompt, error handling
    speech.js   TTS/STT wrappers, spoken-answer matching
    storage.js  localStorage wrappers that never throw
tests/          node --test suites
```
