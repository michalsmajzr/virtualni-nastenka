import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user) {
      const id = session.user.id;

      const boardSql = `
        SELECT COUNT(p.id) AS badge_count FROM posts AS p
        LEFT JOIN badges_posts AS bp ON bp.id_post = p.id AND bp.id_user = ?
        WHERE p.archived IS NULL AND bp.time IS NULL`;
      const boardValue = [id];
      const [board] = await pool.execute<RowDataPacket[]>(boardSql, boardValue);

      const conversationSql = `
        SELECT bc.badge_count + bbm.badge_count AS badge_count 
        FROM (SELECT COUNT(m.id) AS badge_count FROM messages AS m
            LEFT JOIN conversations AS c ON c.id = m.id_conversation
            WHERE m.id_sender != ? AND m.badge_time IS NULL AND (c.id_teacher = ? OR c.id_parent = ?)) AS bc, ( 
        SELECT COUNT(bm.id) AS badge_count FROM bulk_messages AS bm
          LEFT JOIN badges_bulk_messages AS bbm ON bbm.id_bulk_message = bm.id AND bbm.id_user = ?
          WHERE bbm.time IS NULL) AS bbm`;
      const conversationValues = [id, id, id, id];
      const [conversation] = await pool.execute<RowDataPacket[]>(
        conversationSql,
        conversationValues
      );

      const pollSql = `
        SELECT COUNT(q.id) AS badge_count FROM questions AS q
        LEFT JOIN badges_questions AS bq ON bq.id_question = q.id AND bq.id_user = ?
        WHERE bq.time IS NULL`;
      const pollValues = [id];
      const [poll] = await pool.execute<RowDataPacket[]>(pollSql, pollValues);

      const badges = {
        board: board[0].badge_count,
        conversation: conversation[0].badge_count,
        poll: poll[0].badge_count,
      };

      return Response.json({ badges, message: "success" });
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
