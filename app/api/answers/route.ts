import { getSupabaseServerClient } from "../../../lib/supabase-admin";

type SubmittedAnswer = { question?: unknown; answer?: unknown };

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      responderName?: unknown;
      answers?: unknown;
      consent?: unknown;
    };

    if (payload.consent !== true) {
      return Response.json({ error: "ต้องยืนยันก่อนส่งคำตอบ" }, { status: 400 });
    }

    if (!Array.isArray(payload.answers) || payload.answers.length !== 9) {
      return Response.json({ error: "ต้องมีคำตอบครบ 9 ข้อ" }, { status: 400 });
    }

    const answers = payload.answers.map((item: SubmittedAnswer) => ({
      question: typeof item.question === "string" ? item.question.trim().slice(0, 300) : "",
      answer: typeof item.answer === "string" ? item.answer.trim().slice(0, 500) : "",
    }));

    if (answers.some((item) => !item.question || !item.answer)) {
      return Response.json({ error: "คำตอบไม่ครบ" }, { status: 400 });
    }

    const responderName =
      typeof payload.responderName === "string"
        ? payload.responderName.trim().slice(0, 40) || "ยู"
        : "ยู";

    if (process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY) {
      const { error } = await getSupabaseServerClient()
        .from("answer_submissions")
        .insert({
          responder_name: responderName,
          answers_json: answers,
          consent_version: "v1",
        });

      if (error) throw error;
    } else {
      const { getPrisma } = await import("../../../lib/prisma");
      await getPrisma().answerSubmission.create({
        data: {
          responderName,
          answersJson: answers,
          consentVersion: "v1",
        },
      });
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save answer submission", error);
    return Response.json({ error: "บันทึกคำตอบไม่สำเร็จ" }, { status: 500 });
  }
}
