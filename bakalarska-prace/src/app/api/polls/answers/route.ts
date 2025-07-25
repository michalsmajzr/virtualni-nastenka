import { pool } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (session?.user) {
      const { id } = session?.user;
      const formData = await request.formData();
      const answerId = formData.get("answer");
      const questionId = formData.get("question");
      if (!answerId) {
        return Response.json({ error: "missingAnswer" }, { status: 400 });
      }
      if (!questionId) {
        return Response.json({ error: "missingQuestion" }, { status: 400 });
      }

      const sql = `INSERT INTO user_answers (id_question, id_answer, id_user)
        VALUES (?, ?, ?)`;
      const values = [questionId, answerId, id];
      await pool.execute(sql, values);

      return Response.json({ message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (session?.user) {
      const { id } = session?.user;
      const formData = await request.formData();
      const answerId = formData.get("answer");
      const questionId = formData.get("question");
      if (!answerId) {
        return Response.json({ error: "missingAnswer" }, { status: 400 });
      }
      if (!questionId) {
        return Response.json({ error: "missingQuestion" }, { status: 400 });
      }

      const sql = `UPDATE user_answers SET id_answer = ? WHERE id_question = ? AND id_user = ?`;
      const values = [answerId, questionId, id];
      await pool.execute(sql, values);

      return Response.json({ message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
