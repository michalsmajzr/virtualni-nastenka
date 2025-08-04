import { pool } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import validator from "validator";
import parsePhoneNumber from "libphonenumber-js";

export async function GET() {
  try {
    const firstname = "Virtualní";
    const surname = "Nástěnka";
    const password = "root";
    const email = "teacher@virtualninastenka.com";
    const phone = "785 125 478";

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    const sql = `SELECT id FROM users WHERE role = "teacher" `;
    const [row] = await pool.query<RowDataPacket[]>(sql);

    if (!validator.isEmail(email)) {
      return Response.json({ error: "notValidEmail" }, { status: 400 });
    }

    const phoneNumber = parsePhoneNumber(phone, "CZ");
    if (!phoneNumber?.isValid()) {
      return Response.json({ error: "notValidPhone" }, { status: 400 });
    }

    if (row[0]) {
      const updateSql = `UPDATE users SET firstname = ?, surname = ?, phone = ?, email = ?, password = ? WHERE id = ?`;
      const updateValues = [
        firstname,
        surname,
        phoneNumber?.formatInternational(),
        email,
        hash,
        row[0].id,
      ];
      await pool.execute<ResultSetHeader>(updateSql, updateValues);
    } else {
      const insertSql = `INSERT INTO users (firstname, surname, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?)`;
      const insertValues = [
        firstname,
        surname,
        phoneNumber?.formatInternational(),
        email,
        hash,
        "teacher",
      ];
      await pool.execute<ResultSetHeader>(insertSql, insertValues);
    }

    return Response.json({ message: "success" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "serverError" }, { status: 500 });
  }
}
