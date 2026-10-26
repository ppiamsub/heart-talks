"use client";

import { useState } from "react";

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

  function startGame() {
    setIndex(0);
    setDraft("");
    setAnswers([]);
    setConsent(false);
    setSendState("idle");
    setNotice("");
    setScreen("game");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitAnswer() {
    const answer = draft.trim();
    if (!answer) {
      setNotice("เขียนสักนิดก่อนนะยู 🐾");
      return;
    }
    const nextAnswers = [...answers, { question: questions[index], answer }];
    setAnswers(nextAnswers);
    setNotice("");
    setDraft("");
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
  }

  async function sendAnswers() {
    if (!consent || sendState === "sending" || sendState === "sent") return;
    setSendState("sending");
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
        <header className="brand"><span className="paw">●</span> little cat note</header>

        {screen === "welcome" && (
          <section className="welcome screen active">
            <div className="welcome-copy">
              <p className="eyebrow">A TINY GAME FOR ONE SPECIAL GIRL</p>
              <h1><small>กราบสวัสดี</small><br />คุณ<em>บอลลูน</em></h1>
              <p className="intro">มีแมวตัวหนึ่งคาบ 9 คำถามมาให้ยู ตอบตามใจได้เลย ไม่มีถูกผิด และไม่ต้องให้คะแนนอะไรทั้งนั้นนะ</p>
              <button className="primary welcome-button" onClick={startGame}>เปิดซองคำถาม <span>→</span></button>
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
              <div className="note">for you ♡</div><div className="ground" />
            </div>
            <div className="question-preview"><span>เดตในฝัน</span><span>ของกินฮีลใจ</span><span>วันที่เหนื่อย</span><span>คำถามสลับร่าง</span></div>
          </section>
        )}

        {screen === "game" && (
          <section className="game screen active">
            <div className="game-top">
              <button className="round-button" aria-label="กลับหน้าแรก" onClick={() => setScreen("welcome")}>←</button>
              <div className="progress-wrap"><span>คำถาม {index + 1} จาก {questions.length}</span><div className="progress"><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div></div>
              <span className="score-pill">🐾 ยู</span>
            </div>
            <article className="question-card">
              <div className="card-cat"><span>ฅ</span><b>•ﻌ•</b><span>ฅ</span></div>
              <p className="question-number">คำถามที่ {String(index + 1).padStart(2, "0")}</p>
              <h2>{questions[index]}</h2>
              <label className="sr-only" htmlFor="answer">คำตอบของยู</label>
              <textarea id="answer" rows={5} maxLength={300} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="ยูเขียนคำตอบตรงนี้ได้เลย…" autoFocus />
              <div className="answer-footer"><span>{draft.length} / 300</span><button className="primary" onClick={submitAnswer}>{index === questions.length - 1 ? "ดูสรุป →" : "ข้อต่อไป →"}</button></div>
              {notice && <p className="inline-notice" role="status">{notice}</p>}
            </article>
            <p className="cat-tip">🐾 แมวบอกว่า: ค่อย ๆ ตอบ ไม่ต้องรีบนะ</p>
          </section>
        )}

        {screen === "result" && (
          <section className="result-screen screen active">
            <div className="result-cat">ฅ(˶ᵔ ᵕ ᵔ˶)ฅ</div>
            <p className="eyebrow">YOUR LITTLE HEART NOTE</p>
            <h2>9<small> / 9 คำตอบ</small></h2>
            <h3>แมวเก็บทุกคำตอบของยูไว้แล้ว</h3>
            <p>อ่านทวนได้ก่อน แล้วค่อยเลือกว่าจะส่งคำตอบให้ไอนะ</p>

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
                  <div className="hug-scene" aria-label="แมวกับหมาค่อย ๆ เข้ามากอดกัน">
                    <span className="hug-cat" aria-hidden="true">🐱</span>
                    <span className="hug-heart" aria-hidden="true">♥</span>
                    <span className="hug-dog" aria-hidden="true">🐶</span>
                  </div>
                  <p className="success-message">ส่งเรียบร้อยแล้ว ขอบคุณนะยู 🐾</p>
                </div>
              )}
              {sendState === "error" && <p className="error-message">ส่งไม่สำเร็จ ลองกดอีกครั้งนะ</p>}
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
