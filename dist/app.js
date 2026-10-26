const questions = [
  "วันนี้มีเรื่องเล็ก ๆ อะไรที่ทำให้ Balloon ยิ้มได้บ้าง?",
  "ถ้าเลือกเดตในฝันได้หนึ่งวัน อยากให้วันนั้นเป็นแบบไหน?",
  "ของกินอะไรที่ช่วยฮีลใจ Balloon ได้เสมอ?",
  "ถ้ามีแมวพูดได้หนึ่งตัว อยากให้มันบอกอะไรกับ Balloon?",
  "เรื่องเล็ก ๆ แบบไหนที่ทำให้รู้สึกว่าได้รับการใส่ใจ?",
  "ช่วงนี้มีเพลงไหนที่ฟังแล้วรู้สึกว่าเหมือนตัวเองที่สุด?",
  "มีที่ไหนที่อยากไปมาก ๆ ถ้ามีใครสักคนไปด้วยกัน?",
  "คำชมแบบไหนที่ได้ยินแล้ว Balloon จะเขินที่สุด?",
  "ในวันที่เหนื่อย อยากให้คนข้าง ๆ ดูแลแบบไหน?",
  "ถ้าฝากข้อความหนึ่งบรรทัดถึงคนที่ทำเว็บนี้ จะเขียนว่าอะไร?"
];

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
let state = { index: 0, score: 0, selected: 0, answers: [] };

function show(id) {
  $$('.screen').forEach((screen) => screen.classList.toggle('active', screen.id === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startGame() {
  state = { index: 0, score: 0, selected: 0, answers: [] };
  show('game');
  renderQuestion();
}

function renderQuestion() {
  $('#progress-text').textContent = `คำถาม ${state.index + 1} จาก ${questions.length}`;
  $('#progress-bar').style.width = `${((state.index + 1) / questions.length) * 100}%`;
  $('#score-pill').textContent = `♥ ${state.score}`;
  $('#question-number').textContent = `คำถามที่ ${String(state.index + 1).padStart(2, '0')}`;
  $('#question').textContent = questions[state.index];
  $('#answer').value = '';
  $('#char-count').textContent = '0 / 300';
  $('#answer-stage').classList.remove('hidden');
  $('#rating-stage').classList.add('hidden');
  $('#next').classList.add('hidden');
  $('#rating-hint').textContent = 'แตะหัวใจได้เลย';
  state.selected = 0;
  $$('#hearts button').forEach((heart) => { heart.classList.remove('filled'); heart.textContent = '♡'; });
  setTimeout(() => $('#answer').focus(), 200);
}

$('#start').addEventListener('click', startGame);
$('#home').addEventListener('click', () => show('welcome'));
$('#answer').addEventListener('input', (event) => $('#char-count').textContent = `${event.target.value.length} / 300`);

$('#answer-done').addEventListener('click', () => {
  const answer = $('#answer').value.trim();
  if (!answer) { showToast('เขียนสักนิดก่อนนะ Balloon 🐾'); $('#answer').focus(); return; }
  $('#answer-display').textContent = answer;
  $('#answer-stage').classList.add('hidden');
  $('#rating-stage').classList.remove('hidden');
});

$$('#hearts button').forEach((button) => button.addEventListener('click', () => {
  state.selected = Number(button.dataset.value);
  $$('#hearts button').forEach((heart, index) => {
    const filled = index < state.selected;
    heart.classList.toggle('filled', filled);
    heart.textContent = filled ? '♥' : '♡';
  });
  const hints = ['', 'นิดนึง', 'น่ารักดี', 'ชอบอยู่นะ', 'โดนใจมาก', 'ชอบที่สุดเลย ♡'];
  $('#rating-hint').textContent = hints[state.selected];
  $('#next').classList.remove('hidden');
  $('#next').innerHTML = state.index === questions.length - 1 ? 'เปิดบันทึกของ Balloon <span>→</span>' : 'ข้อต่อไป <span>→</span>';
}));

$('#next').addEventListener('click', () => {
  if (!state.selected) return;
  state.answers.push({ question: questions[state.index], answer: $('#answer-display').textContent, rating: state.selected });
  state.score += state.selected;
  state.index += 1;
  if (state.index === questions.length) return renderResult();
  renderQuestion();
});

function renderResult() {
  $('#result-score').textContent = state.score;
  $('#result-title').textContent = state.score >= 43 ? 'Balloon กับแมวใจตรงกันมาก' : state.score >= 32 ? 'แมวรู้จัก Balloon มากขึ้นแล้ว' : 'คำตอบของ Balloon น่ารักกว่าคะแนนอีก';
  $('#answer-list').innerHTML = state.answers.map((item, index) => `<article class="result-answer"><small>${String(index + 1).padStart(2, '0')} · ${'♥'.repeat(item.rating)}</small><p>${escapeHtml(item.answer)}</p></article>`).join('');
  try { localStorage.setItem('balloon-heart-note', JSON.stringify({ score: state.score, answers: state.answers })); } catch {}
  show('result');
}

function escapeHtml(text) {
  return text.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

$('#again').addEventListener('click', startGame);
$('#copy').addEventListener('click', async () => {
  const summary = [`บันทึกใจของ Balloon — ${state.score}/50 หัวใจ`, ...state.answers.map((item, index) => `${index + 1}. ${item.answer} (${'♥'.repeat(item.rating)})`)].join('\n');
  try { await navigator.clipboard.writeText(summary); showToast('คัดลอกบันทึกแล้ว 🐾'); }
  catch { showToast('คัดลอกไม่ได้ ลองแคปหน้าจอแทนนะ'); }
});

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}
