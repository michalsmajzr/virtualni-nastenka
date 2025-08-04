import { pool } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user) {
      const id = session.user.id;

      const sql = `
        SELECT q.id, q.question, bq.time AS badge_time FROM questions AS q
        LEFT JOIN badges_questions AS bq ON bq.id_question = q.id AND bq.id_user = ?
        ORDER BY q.time DESC;`;
      const value = [id];
      const [polls] = await pool.execute<RowDataPacket[]>(sql, value);

      return Response.json({ polls, message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    const session = await auth();
    if (session?.user && session?.user.role === "teacher") {
      connection = await pool.getConnection();

      const data = await request.json();
      const { question, answers } = data;
      if (!question) {
        return Response.json({ error: "missingQuestion" }, { status: 400 });
      }
      if (!answers || answers.length < 2) {
        return Response.json({ error: "missingAnswers" }, { status: 400 });
      }

      if (question.length > 255) {
        return Response.json({ error: "questionTooLong" }, { status: 400 });
      }

      const questionSql = `INSERT INTO questions (question) VALUES (?)`;
      const questionValue = [question];
      await connection.beginTransaction();
      const [result] = await connection.execute<ResultSetHeader>(
        questionSql,
        questionValue
      );

      const answerSql = `INSERT INTO answers (id_question, answer) VALUES ?`;
      const answerValues: [number, string][] = [];
      for (let i = 0; i < answers.length; i++) {
        if (answers[i].answer.length > 30) {
          return Response.json({ error: "answerTooLong" }, { status: 400 });
        }
        answerValues.push([result.insertId, answers[i].answer]);
      }
      await connection.query(answerSql, [answerValues]);
      await connection.commit();

      return Response.json({ message: "successCreatePoll" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    await connection?.rollback();
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  } finally {
    connection?.release();
  }
}
