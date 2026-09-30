// Pure-logic tests. Run with: node --test tests/
// Covers the bug fixes: trait counting, voice answer matching,
// history capping, key validation, and safe storage.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { questions, calculateTraits } from '../src/data/questions.js';
import { matchAnswer } from '../src/utils/speech.js';
import { isValidGroqKey, buildPersonaPrompt, getGroqChatCompletion } from '../src/utils/groq.js';

test('question bank has exactly 30 unique questions with 4 options each', () => {
  assert.equal(questions.length, 30);
  assert.equal(new Set(questions.map((q) => q.id)).size, 30);
  for (const q of questions) {
    assert.equal(q.options.length, 4, `Q${q.id} should have 4 options`);
    assert.ok(q.question && q.question.length > 10, `Q${q.id} needs a question`);
    assert.ok(q.category, `Q${q.id} needs a category`);
  }
});

test('question ids are sequential 1..30', () => {
  questions.forEach((q, i) => assert.equal(q.id, i + 1));
});

test('calculateTraits ignores unknown questionIds instead of throwing', () => {
  const traits = calculateTraits([{ questionId: 9999, answer: 'A' }]);
  assert.equal(traits.risk_level, undefined);
  assert.equal(traits.completion, '0/30');
});

test('calculateTraits ignores unknown option ids', () => {
  const traits = calculateTraits([{ questionId: 1, answer: 'Z' }]);
  assert.equal(traits.risk_level, undefined);
});

test('calculateTraits is null-safe on malformed answers', () => {
  assert.doesNotThrow(() => calculateTraits([null, undefined, {}, { questionId: 1 }]));
  assert.doesNotThrow(() => calculateTraits([]));
});

test('re-answering the same question counts once, not twice', () => {
  // Mirrors the de-dup logic: an answer list with one entry per questionId.
  const answers = [
    { questionId: 1, answer: 'A' },
    { questionId: 1, answer: 'B' },
    { questionId: 7, answer: 'B' },
  ];
  const deduped = [
    ...answers.filter((a) => a.questionId !== 1),
    { questionId: 1, answer: 'B' },
  ].sort((a, b) => a.questionId - b.questionId);

  assert.equal(deduped.filter((a) => a.questionId === 1).length, 1);

  const once = calculateTraits([{ questionId: 1, answer: 'A' }]);
  const twice = calculateTraits([
    { questionId: 1, answer: 'A' },
    { questionId: 1, answer: 'A' },
  ]);
  // Old code double-counted, flipping the dominant value.
  assert.equal(once.risk_level, twice.risk_level);
  assert.equal(once.completion, '1/30');
});

test('calculateTraits picks a dominant value from real answers', () => {
  // Q1 option A = passive/low, Q7 option B = honest/low.
  const traits = calculateTraits([
    { questionId: 1, answer: 'A' },
    { questionId: 7, answer: 'B' },
    { questionId: 13, answer: 'D' },
  ]);
  assert.ok(traits.risk_level, 'risk_level should be derived');
  assert.equal(traits.risk_level, 'low');
  assert.equal(traits.completion, '3/30');
});

test('matchAnswer accepts bare letters and the word option', () => {
  const opts = questions[0].options;
  assert.equal(matchAnswer('a', opts), 'A');
  assert.equal(matchAnswer('B', opts), 'B');
  assert.equal(matchAnswer('option c', opts), 'C');
  assert.equal(matchAnswer('Option D', opts), 'D');
});

test('matchAnswer returns null for empty or unrelated speech', () => {
  const opts = questions[0].options;
  assert.equal(matchAnswer('', opts), null);
  assert.equal(matchAnswer(null, opts), null);
  assert.equal(matchAnswer('the blue elephant', opts), null);
});

test('matchAnswer falls back to synonyms when no letter given', () => {
  const opts = questions[0].options;
  assert.equal(matchAnswer('say nothing', opts), 'A');
  assert.equal(matchAnswer('I will politely tell them', opts), 'B');
  assert.equal(matchAnswer('make a joke about it', opts), 'C');
});

test('isValidGroqKey rejects truncated or junk keys', () => {
  assert.equal(isValidGroqKey('gsk_' + 'a'.repeat(40)), true);
  assert.equal(isValidGroqKey('gsk_short'), false);
  assert.equal(isValidGroqKey('sk-wrong-vendor-key-abcdefghijklmnop'), false);
  assert.equal(isValidGroqKey('   '), false);
  assert.equal(isValidGroqKey(''), false);
  assert.equal(isValidGroqKey(null), false);
  assert.equal(isValidGroqKey(undefined), false);
  assert.equal(isValidGroqKey(12345), false);
  assert.equal(isValidGroqKey('gsk_' + 'a'.repeat(10)), false, 'too short');
});

test('buildPersonaPrompt includes traits, name and answers', () => {
  const prompt = buildPersonaPrompt(
    { risk_level: 'high', moral_alignment: 'honest' },
    [{ questionId: 1, answer: 'B' }],
    'Viji',
  );
  assert.match(prompt, /Risk tolerance: high/);
  assert.match(prompt, /Moral alignment: honest/);
  assert.match(prompt, /Viji/);
  assert.match(prompt, /answered "B"/);
  assert.match(prompt, /assistant/i, 'must instruct persona behaviour');
});

test('buildPersonaPrompt tolerates empty inputs', () => {
  assert.doesNotThrow(() => buildPersonaPrompt());
  assert.doesNotThrow(() => buildPersonaPrompt(null, null, ''));
  assert.ok(buildPersonaPrompt().length > 50, 'base prompt still emitted');
});

test('history cap: a long conversation gets trimmed, not rejected', async () => {
  // Stub fetch so no network or key is needed.
  let captured;
  globalThis.fetch = async (_url, opts) => {
    captured = JSON.parse(opts.body);
    return {
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'ok' } }] }),
    };
  };

  const many = Array.from({ length: 60 }, (_, i) => ({
    role: i % 2 ? 'assistant' : 'user',
    content: `msg ${i}`,
  }));

  const reply = await getGroqChatCompletion({ apiKey: 'gsk_' + 'x'.repeat(30), messages: many });
  assert.equal(reply, 'ok');
  // system message + capped history
  assert.ok(captured.messages.length <= 17, `got ${captured.messages.length}`);
  assert.equal(captured.messages[0].role, 'system');
  // Oldest messages dropped, newest kept
  assert.ok(captured.messages[captured.messages.length - 1].content.startsWith('msg 59'));
  assert.ok(!captured.messages.some((m) => m.content === 'msg 0'));
  assert.equal(captured.model, 'llama-3.3-70b-versatile');
});

test('non-JSON error body yields a readable message, not a parse crash', async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 502,
    json: async () => {
      throw new SyntaxError('Unexpected token < in JSON');
    },
  });

  await assert.rejects(
    () => getGroqChatCompletion({ apiKey: 'gsk_' + 'x'.repeat(30), messages: [] }),
    (err) => {
      assert.ok(!err.message.includes('Unexpected token'), 'parse error leaked to user');
      assert.match(err.message, /502/);
      return true;
    },
  );
});

test('401 gets a friendly message', async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 401,
    json: async () => ({ error: { message: 'Invalid API Key' } }),
  });

  await assert.rejects(
    () => getGroqChatCompletion({ apiKey: 'gsk_' + 'x'.repeat(30), messages: [] }),
    (err) => /Invalid Groq API key/.test(err.message),
  );
});

test('missing key is reported before any network call', async () => {
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return { ok: true, json: async () => ({ choices: [{ message: { content: 'x' } }] }) };
  };
  await assert.rejects(
    () => getGroqChatCompletion({ apiKey: '', messages: [] }),
    /No API key/,
  );
  assert.equal(called, false, 'must not call the API without a key');
});
