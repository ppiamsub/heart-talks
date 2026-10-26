const banks = {
  cute: [
    "ถ้าเราได้หายตัวไปหนึ่งวัน อยากพากันไปไหน?",
    "มีโมเมนต์ไหนของเราที่นึกถึงแล้วต้องแอบยิ้ม?",
    "ถ้าต้องตั้งชื่อหนังให้เรื่องของเรา จะชื่อว่าอะไร?",
    "อาหารหนึ่งอย่างที่อยากทำให้อีกคนกินคืออะไร?",
    "นิสัยเล็ก ๆ ของอีกคนที่ดูน่ารักโดยเจ้าตัวไม่รู้คืออะไร?",
    "ถ้าเลือกเพลงหนึ่งเพลงเป็นเพลงของเรา จะเลือกเพลงอารมณ์แบบไหน?",
    "เดตในฝันแบบงบน้อยแต่ใจฟู หน้าตาเป็นยังไง?",
    "ถ้าพรุ่งนี้ตื่นมาแล้วสลับร่างกัน สิ่งแรกที่จะทำคืออะไร?",
    "ของขวัญทำมืออะไรที่อยากได้จากอีกคน?",
    "คำชมแบบไหนที่ได้ยินแล้วเขินที่สุด?",
    "ถ้าเราเป็นขนมคนละชนิด เราจะเป็นขนมอะไร?",
    "สถานที่ธรรมดาที่อยากไปด้วยกันบ่อย ๆ คือที่ไหน?"
  ],
  deep: [
    "ช่วงเวลาไหนที่รู้สึกว่าอีกคนเข้าใจเรามากที่สุด?",
    "เรื่องเล็ก ๆ แบบไหนที่ทำให้รู้สึกว่าได้รับการใส่ใจ?",
    "วันที่เหนื่อยมาก อยากให้อีกคนอยู่ข้าง ๆ แบบไหน?",
    "มีเรื่องอะไรเกี่ยวกับตัวเองที่อยากให้อีกคนเข้าใจมากขึ้น?",
    "ความสัมพันธ์ที่ดีในแบบของคุณหน้าตาเป็นอย่างไร?",
    "ปีนี้มีสิ่งไหนที่อยากให้อีกคนคอยเชียร์?",
    "มีความทรงจำวัยเด็กเรื่องไหนที่อยากพาอีกคนกลับไปดู?",
    "อะไรคือพื้นที่ปลอดภัยของคุณ และเราช่วยสร้างมันได้ยังไง?",
    "คำขอบคุณอะไรที่ยังไม่เคยพูดกับอีกคน?",
    "ถ้าส่งจดหมายหาเราในอีกหนึ่งปี อยากเขียนว่าอะไร?",
    "มีความกลัวเล็ก ๆ อะไรที่อยากให้อีกคนจับมือผ่านไปด้วยกัน?",
    "อะไรที่ทำให้คุณรู้สึกเป็นตัวเองที่สุดเวลาเราอยู่ด้วยกัน?"
  ]
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const screens = $$('.screen');
let state = { players: [], questions: [], index: 0, score: 0, results: [], mode: 'cute', selectedRating: 0 };

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function show(id) {
  screens.forEach((screen) => screen.classList.toggle('active', screen.id === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('#round-count').addEventListener('input', (event) => $('#round-output').value = event.target.value);
$('#answer').addEventListener('input', (event) => $('#char-count').textContent = `${event.target.value.length} / 240`);

$('#setup-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const one = $('#player-one').value.trim();
  const two = $('#player-two').value.trim();
  if (!one || !two) return;
  const mode = new FormData(event.currentTarget).get('mode');
  const count = Number($('#round-count').value);
  const pool = mode === 'mix' ? [...banks.cute, ...banks.deep] : banks[mode];
  state = { players: [one, two], questions: shuffle(pool).slice(0, count), index: 0, score: 0, results: [], mode, selectedRating: 0 };
  localStorage.setItem('heart-talk-names', JSON.stringify(state.players));
  show('game');
  renderQuestion();
});

function renderQuestion() {
  const answerer = state.index % 2;
  const rater = answerer === 0 ? 1 : 0;
  $('#progress-text').textContent = `คำถาม ${state.index + 1} / ${state.questions.length}`;
  $('#progress-bar').style.width = `${((state.index + 1) / state.questions.length) * 100}%`;
  $('#total-score').textContent = `♡ ${state.score}`;
  $('#category').textContent = state.mode === 'cute' ? 'ละมุน' : state.mode === 'deep' ? 'ลึกขึ้น' : 'เซอร์ไพรส์';
  $('#turn-label').textContent = `ตาของ ${state.players[answerer]}`;
  $('#question').textContent = state.questions[state.index];
  $('#answerer-name').textContent = `คำตอบของ ${state.players[answerer]}`;
  $('#rater-name').textContent = state.players[rater];
  $('#answer').value = '';
  $('#char-count').textContent = '0 / 240';
  $('#answer-stage').classList.remove('hidden');
  $('#rating-stage').classList.add('hidden');
  $('#next').classList.add('hidden');
  $$('#hearts button').forEach((heart) => { heart.classList.remove('filled'); heart.textContent = '♡'; });
  state.selectedRating = 0;
  setTimeout(() => $('#answer').focus(), 250);
}

$('#reveal').addEventListener('click', () => {
  const answer = $('#answer').value.trim();
  if (!answer) { $('#answer').focus(); showToast('ขอคำตอบสักนิดนะ ♡'); return; }
  $('#answer-display').textContent = answer;
  $('#answer-stage').classList.add('hidden');
  $('#rating-stage').classList.remove('hidden');
});

$$('#hearts button').forEach((button) => button.addEventListener('click', () => {
  state.selectedRating = Number(button.dataset.value);
  $$('#hearts button').forEach((heart, index) => {
    const filled = index < state.selectedRating;
    heart.classList.toggle('filled', filled);
    heart.textContent = filled ? '♥' : '♡';
  });
  const hints = ['', 'น่ารักดีนะ', 'ฟังต่อได้อยู่', 'ชอบคำตอบนี้', 'ใจฟูมาก', 'เก็บไว้คิดถึงเลย'];
  $('#rating-hint').textContent = hints[state.selectedRating];
  $('#next').classList.remove('hidden');
  $('#next').textContent = state.index === state.questions.length - 1 ? 'ดูคะแนนของเรา →' : 'คำถามถัดไป →';
}));

$('#next').addEventListener('click', () => {
  if (!state.selectedRating) return;
  state.score += state.selectedRating;
  state.results.push({ question: state.questions[state.index], answer: $('#answer-display').textContent, rating: state.selectedRating, by: state.players[state.index % 2] });
  state.index += 1;
  if (state.index >= state.questions.length) return renderResult();
  renderQuestion();
});

function renderResult() {
  const max = state.questions.length * 5;
  const ratio = state.score / max;
  $('#result-score').textContent = state.score;
  $('#max-score').textContent = max;
  let title = 'คืนนี้อบอุ่นกว่าปกตินะ';
  if (ratio >= .9) title = 'ใจตรงกันแบบไม่ต้องเดาเลย';
  else if (ratio >= .72) title = 'คู่นี้มีเรื่องคุยกันอีกเยอะเลย';
  else if (ratio < .55) title = 'คะแนนไม่สำคัญ เท่ากับได้ฟังกัน';
  $('#result-title').textContent = title;
  const favorites = [...state.results].sort((a, b) => b.rating - a.rating).slice(0, 2);
  $('#memory-list').innerHTML = favorites.map((item) => `<div class="memory"><small>${'♥'.repeat(item.rating)} · ${escapeHtml(item.by)}</small><p>${escapeHtml(item.answer)}</p></div>`).join('');
  show('result');
}

function escapeHtml(text) {
  return text.replace(/[&<>'"]/g, (character) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
}

function resetGame() {
  state = { players: [], questions: [], index: 0, score: 0, results: [], mode: 'cute', selectedRating: 0 };
  show('setup');
}

$('#quit').addEventListener('click', resetGame);
$('#again').addEventListener('click', resetGame);
$('#copy-result').addEventListener('click', async () => {
  const text = `${state.players[0]} × ${state.players[1]} เล่น “ใจตรงกันไหม?” ได้ ${state.score}/${state.questions.length * 5} หัวใจ ♡`;
  try { await navigator.clipboard.writeText(text); showToast('คัดลอกคะแนนแล้ว ♡'); }
  catch { showToast(text); }
});

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

try {
  const saved = JSON.parse(localStorage.getItem('heart-talk-names'));
  if (Array.isArray(saved)) { $('#player-one').value = saved[0] || ''; $('#player-two').value = saved[1] || ''; }
} catch {}
