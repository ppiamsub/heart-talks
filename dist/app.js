const questions = [
  "วันนี้มีเรื่องเล็ก ๆ อะไรที่ทำให้ยูยิ้มได้บ้าง?",
  "ถ้าเลือกเดตในฝันได้หนึ่งวัน อยากให้วันนั้นเป็นแบบไหน?",
  "ของกินอะไรที่ช่วยฮีลใจยูได้เสมอ?",
  "เรื่องเล็ก ๆ แบบไหนที่ทำให้รู้สึกว่าได้รับการใส่ใจ?",
  "ช่วงนี้มีเพลงไหนที่ฟังแล้วรู้สึกว่าเหมือนตัวเองที่สุด?",
  "มีที่ไหนที่อยากไปมาก ๆ ถ้ามีใครสักคนไปด้วยกัน?",
  "คำชมแบบไหนที่ได้ยินแล้วยูจะเขินที่สุด?",
  "ในวันที่เหนื่อย อยากให้คนข้าง ๆ ดูแลแบบไหน?",
  "ถ้าให้กอดได้ 1 คน ระหว่างไอในร่างแฟนเก่ายู กับแฟนเก่ายูในร่างไอ ยูจะเลือกใคร เพราะอะไร?"
];

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
let state = { index: 0, answers: [] };

function show(id) {
  $$('.screen').forEach((screen) => screen.classList.toggle('active', screen.id === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startGame() {
  state = { index: 0, answers: [] };
  show('game');
  renderQuestion();
}

function renderQuestion() {
  $('#progress-text').textContent = `คำถาม ${state.index + 1} จาก ${questions.length}`;
  $('#progress-bar').style.width = `${((state.index + 1) / questions.length) * 100}%`;
  $('#question-number').textContent = `คำถามที่ ${String(state.index + 1).padStart(2, '0')}`;
  $('#question').textContent = questions[state.index];
  $('#answer').value = '';
  $('#char-count').textContent = '0 / 300';
  $('#answer-stage').classList.remove('hidden');
  setTimeout(() => $('#answer').focus(), 200);
}

$('#start').addEventListener('click', startGame);
$('#home').addEventListener('click', () => show('welcome'));
$('#answer').addEventListener('input', (event) => $('#char-count').textContent = `${event.target.value.length} / 300`);

$('#answer-done').addEventListener('click', () => {
  const answer = $('#answer').value.trim();
  if (!answer) { showToast('เขียนสักนิดก่อนนะยู 🐾'); $('#answer').focus(); return; }
  state.answers.push({ question: questions[state.index], answer });
  state.index += 1;
  if (state.index === questions.length) return renderResult();
  renderQuestion();
});

function renderResult() {
  $('#answer-list').innerHTML = state.answers.map((item, index) => `<article class="result-answer"><small>คำตอบที่ ${String(index + 1).padStart(2, '0')}</small><p>${escapeHtml(item.answer)}</p></article>`).join('');
  try { localStorage.setItem('you-little-note', JSON.stringify({ answers: state.answers })); } catch {}
  show('result');
}

function escapeHtml(text) {
  return text.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

$('#again').addEventListener('click', startGame);
$('#copy').addEventListener('click', async () => {
  const summary = ['คำตอบของยู', ...state.answers.map((item, index) => `${index + 1}. ${item.answer}`)].join('\n');
  try { await navigator.clipboard.writeText(summary); showToast('คัดลอกบันทึกแล้ว 🐾'); }
  catch { showToast('คัดลอกไม่ได้ ลองแคปหน้าจอแทนนะ'); }
});

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}
