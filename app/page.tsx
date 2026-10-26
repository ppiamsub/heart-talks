"use client";

import { useRef, useState } from "react";

const questions = [
  "วันนี้มีเรื่องเล็ก ๆ อะไรที่ทำให้ยูยิ้มได้บ้าง?",
  "ถ้าเลือกเดตในฝันได้หนึ่งวัน อยากให้วันนั้นเป็นแบบไหน?",
  "ของกินอะไรที่ช่วยฮีลใจยูได้เสมอ?",
  "เรื่องเล็ก ๆ แบบไหนที่ทำให้รู้สึกว่าได้รับการใส่ใจ?",
  "ช่วงนี้มีเพลงไหนที่ฟังแล้วรู้สึกว่าเหมือนตัวเองที่สุด?",
  "มีที่ไหนที่อยากไปมาก ๆ ถ้ามีใครสักคนไปด้วยกัน?",
  "คำชมแบบไหนที่ได้ยินแล้วยูจะเขินที่สุด?",
  "ในวันที่เหนื่อย อยากให้คนข้าง ๆ ดูแลแบบไหน?",
  "ถ้าให้กอดได้ 1 คน ระหว่างไอในร่างแฟนเก่ายู กับแฟนเก่ายูในร่างไอ ยูจะเลือกใคร เพราะอะไร?",
];

type Answer = { question: string; answer: string };
type Screen = "welcome" | "game" | "result";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [consent, setConsent] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [isAdvancing, setIsAdvancing] = useState(false);
  const deliverySceneRef = useRef<HTMLDivElement>(null);

  const catMood = answers.length >= 7 ? "ecstatic" : answers.length >= 4 ? "happy" : answers.length >= 1 ? "warming" : "shy";
  const catFace = catMood === "ecstatic" ? "✦ ᴗ ✦" : catMood === "happy" ? "ᵔ ᵕ ᵔ" : catMood === "warming" ? "• ◡ •" : "• ᴗ •";
  const happiness = Math.round((answers.length / questions.length) * 100);
  const companionMessage = isAdvancing
    ? answers.length >= 7 ? "เย้! แมวมีความสุขที่สุดเลย!" : "เก่งมาก! แมวยิ้มกว้างขึ้นแล้ว"
    : draft
      ? answers.length >= 4 ? "เล่าต่อได้เลย แมวชอบฟังมาก ♡" : "อื้อฮึ… แมวฟังอยู่นะ"
      : answers.length >= 7 ? "อีกนิดเดียวก็ถึงเส้นชัยแล้ว!" : answers.length >= 4 ? "แมวเริ่มยิ้มไม่หุบแล้วนะ" : answers.length ? "ได้รู้จักยูเพิ่มอีกนิดแล้ว ♡" : "ค่อย ๆ คิดได้เลย เมี้ยว~";

  function startGame() {
    setIndex(0);
    setDraft("");
    setAnswers([]);
    setConsent(false);
    setSendState("idle");
    setNotice("");
    setIsAdvancing(false);
    setScreen("game");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitAnswer() {
    if (isAdvancing) return;
    const answer = draft.trim();
    if (!answer) {
      setNotice("เขียนสักนิดก่อนนะยู 🐾");
      return;
    }
    const nextAnswers = [...answers, { question: questions[index], answer }];
    setAnswers(nextAnswers);
    setNotice("");
    setIsAdvancing(true);

    window.setTimeout(() => {
      setDraft("");
      setIsAdvancing(false);
      if (index === questions.length - 1) {
        setScreen("result");
        try {
          localStorage.setItem("you-little-note", JSON.stringify({ answers: nextAnswers }));
        } catch {}
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setIndex(index + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 720);
  }

  async function sendAnswers() {
    if (!consent || sendState === "sending" || sendState === "sent") return;
    setSendState("sending");
    window.setTimeout(() => {
      deliverySceneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    try {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ responderName: "ยู", answers, consent: true }),
      });
      if (!response.ok) throw new Error("submit failed");
      setSendState("sent");
    } catch {
      setSendState("error");
    }
  }

  async function copyAnswers() {
    const summary = ["คำตอบของยู", ...answers.map((item, answerIndex) => `${answerIndex + 1}. ${item.answer}`)].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      setNotice("คัดลอกบันทึกแล้ว 🐾");
    } catch {
      setNotice("คัดลอกไม่ได้ ลองแคปหน้าจอแทนนะ");
    }
  }

  return (
    <>
      <div className="leaf leaf-a" />
      <div className="leaf leaf-b" />
      <main className="shell">
        <header className="brand"><span className="paw">●</span> little cat quest <span className="online-dot">online</span></header>

        {screen === "welcome" && (
          <section className="welcome screen active">
            <div className="welcome-copy">
              <div className="quest-kicker"><span>COZY QUEST</span><b>9 STAGES</b></div>
              <p className="eyebrow">A TINY GAME FOR ONE SPECIAL GIRL</p>
              <h1><small>กราบสวัสดี</small><br />คุณ<em>บอลลูน</em></h1>
              <p className="intro">มีแมวตัวหนึ่งคาบภารกิจ 9 ด่านมาให้ยู ตอบตามใจได้เลย ไม่มีถูกผิด ผ่านแต่ละด่านแล้วเก็บหัวใจไปจนถึงเส้นชัยนะ</p>
              <div className="quest-stats" aria-label="รายละเอียดเกม">
                <span><b>9</b> ด่าน</span><span><b>∞</b> เวลา</span><span><b>♡</b> ไม่มีแพ้</span>
              </div>
              <button className="primary welcome-button" onClick={startGame}>เริ่มภารกิจ <span>▶</span></button>
              <p className="privacy">คำตอบจะส่งให้คนทำเว็บก็ต่อเมื่อยูกดยืนยันตอนจบ</p>
            </div>

            <div className="cat-scene" aria-label="แมวสีน้ำตาลนั่งในสวนสีเขียว">
              <div className="sun" />
              <div className="plant plant-left"><i /><i /><i /></div>
              <div className="plant plant-right"><i /><i /><i /></div>
              <div className="cat-tail" /><div className="cat-body" />
              <div className="cat-head">
                <div className="ear left" /><div className="ear right" />
                <div className="cat-face"><i className="eye" /><i className="eye" /><b>ᴗ</b></div>
              </div>
              <div className="note"><small>NEW QUEST!</small>for you ♡</div><div className="ground" />
            </div>
            <div className="question-preview"><span>เดตในฝัน</span><span>ของกินฮีลใจ</span><span>วันที่เหนื่อย</span><span>คำถามสลับร่าง</span></div>
          </section>
        )}

        {screen === "game" && (
          <section className="game screen active">
            <div className="game-ambience" aria-hidden="true">
              <i className="cloud cloud-one" /><i className="cloud cloud-two" />
              <i className="float-star star-one">✦</i><i className="float-star star-two">✧</i><i className="float-star star-three">✦</i>
            </div>
            <div className="game-top">
              <button className="round-button" aria-label="กลับหน้าแรก" onClick={() => setScreen("welcome")}>←</button>
              <div className="progress-wrap"><span>STAGE {String(index + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span><div className="progress"><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div></div>
              <span className="score-pill">♥ {answers.length}</span>
            </div>

            <nav className="quest-map" aria-label="เส้นทางคำถาม">
              {questions.map((_, questionIndex) => (
                <span
                  className={questionIndex < index ? "done" : questionIndex === index ? "current" : "locked"}
                  key={questionIndex}
                  aria-label={`ด่าน ${questionIndex + 1}${questionIndex < index ? " ผ่านแล้ว" : questionIndex === index ? " ด่านปัจจุบัน" : " ยังไม่ถึง"}`}
                >
                  {questionIndex < index ? "✓" : questionIndex + 1}
                </span>
              ))}
            </nav>

            <article className={`question-card ${isAdvancing ? "is-cleared" : ""}`} key={index}>
              <span className="quest-label">MAIN QUEST</span>
              <div className="card-cat"><span>ฅ</span><b>•ﻌ•</b><span>ฅ</span></div>
              <p className="question-number">ภารกิจที่ {String(index + 1).padStart(2, "0")}</p>
              <h2>{questions[index]}</h2>
              <label className="sr-only" htmlFor="answer">คำตอบของยู</label>
              <div className={`answer-zone ${draft ? "has-answer" : ""}`}>
                <textarea id="answer" rows={5} maxLength={300} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="ยูเขียนคำตอบตรงนี้ได้เลย…" autoFocus disabled={isAdvancing} />
                <div className="typing-hearts" aria-hidden="true"><i>♥</i><i>♥</i><i>♥</i></div>
              </div>
              <div className="answer-footer"><span className="typing-score">✦ {draft.length} / 300</span><button className="primary" onClick={submitAnswer} disabled={isAdvancing}>{isAdvancing ? "ผ่านแล้ว! ♥" : index === questions.length - 1 ? "เข้าเส้นชัย ✦" : "ผ่านด่านนี้ →"}</button></div>
              {notice && <p className="inline-notice" role="status">{notice}</p>}
            </article>
            <div className={`stage-clear ${isAdvancing ? "show" : ""}`} aria-live="polite">
              <b>STAGE CLEAR!</b><span>+1 ♥</span>
            </div>
            <aside className={`quest-companion mood-${catMood} ${draft ? "is-listening" : ""} ${isAdvancing ? "is-celebrating" : ""}`} aria-label={`แมวผู้ช่วยมีความสุข ${happiness} เปอร์เซ็นต์`}>
              <div className="companion-speech">
                <span>{companionMessage}</span>
                <div className="cat-joy"><small>ความสุขแมว</small><div><i style={{ width: `${Math.max(8, happiness)}%` }} /></div><b>{answers.length}/9 ♥</b></div>
              </div>
              <div className="mini-cat" aria-hidden="true">
                <i className="mini-tail" /><i className="mini-body" />
                <i className="mini-head"><b className="mini-ear left" /><b className="mini-ear right" /><span>{catFace}</span><em className="mini-cheek left" /><em className="mini-cheek right" /></i>
                <i className="mini-paw left" /><i className="mini-paw right" />
              </div>
              <div className="companion-shadow" aria-hidden="true" />
            </aside>
            <p className="cat-tip"><span>🐾</span> คำใบ้จากแมว: ค่อย ๆ ตอบ ไม่มีจับเวลานะ</p>
          </section>
        )}

        {screen === "result" && (
          <section className="result-screen screen active">
            <div className="confetti" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
            <p className="complete-badge">QUEST COMPLETE!</p>
            <div className="result-cat">ฅ(˶ᵔ ᵕ ᵔ˶)ฅ</div>
            <p className="eyebrow">YOUR LITTLE HEART NOTE</p>
            <h2>9<small> / 9 คำตอบ</small></h2>
            <h3>แมวเก็บทุกคำตอบของยูไว้แล้ว</h3>
            <p>อ่านทวนได้ก่อน แล้วค่อยเลือกว่าจะส่งคำตอบให้ไอนะ</p>

            <div className="reward-row" aria-label="รางวัลที่ได้รับ">
              <span><b>♥ 9</b> หัวใจ</span><span><b>★</b> คนเก่ง</span><span><b>∞</b> ความน่ารัก</span>
            </div>

            <div className="answer-list">
              {answers.map((item, answerIndex) => (
                <article className="result-answer" key={item.question}>
                  <small>คำตอบที่ {String(answerIndex + 1).padStart(2, "0")}</small>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>

            <div className="send-card">
              <label className="consent-row">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} disabled={sendState === "sent"} />
                <span>ยูยินยอมส่งคำตอบทั้ง 9 ข้อให้คนที่ทำเว็บนี้ และให้เก็บไว้เพื่ออ่านภายหลัง</span>
              </label>
              <button className="primary send-button" onClick={sendAnswers} disabled={!consent || sendState === "sending" || sendState === "sent"}>
                {sendState === "sending" ? "กำลังส่ง…" : sendState === "sent" ? "ส่งให้ไอแล้ว ✓" : "ส่งคำตอบให้ไอ ♡"}
              </button>
              {sendState === "sent" && (
                <div className="sent-celebration" aria-live="polite">
                  <p className="success-message">ส่งเรียบร้อยแล้ว ขอบคุณนะยู 🐾</p>
                </div>
              )}
              {sendState === "error" && <p className="error-message">ส่งไม่สำเร็จ ลองกดอีกครั้งนะ</p>}
            </div>

            <div ref={deliverySceneRef} className={`letter-quest ${sendState === "sending" ? "is-sending" : ""} ${sendState === "sent" ? "is-delivered" : ""}`} aria-label={sendState === "sent" ? "แมวมอบจดหมายให้หมาเรียบร้อยแล้ว" : "แมวถือจดหมายรอมอบให้หมาที่เส้นชัย"}>
              <span className="finish-sign">FINISH</span>
              <div className="delivery-ground" />
              <div className="delivery-cat" aria-hidden="true">🐱</div>
              <div className="delivery-letter" aria-hidden="true">💌</div>
              <div className="delivery-dog" aria-hidden="true">🐶</div>
              <div className="delivery-heart" aria-hidden="true">♥</div>
              <p>{sendState === "sent" ? "จดหมายถึงมือหมาแล้ว ♡" : sendState === "sending" ? "แมวกำลังวิ่งไปส่งจดหมาย…" : "แมวถือจดหมายรออยู่ที่เส้นชัย"}</p>
            </div>

            <div className="result-actions">
              <button className="secondary" onClick={copyAnswers}>คัดลอกสรุป</button>
              <button className="secondary" onClick={startGame}>เล่นอีกครั้ง</button>
            </div>
            {notice && <p className="inline-notice" role="status">{notice}</p>}
          </section>
        )}
      </main>
    </>
  );
}
