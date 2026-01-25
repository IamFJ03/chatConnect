export const runtime = "nodejs";

import joi from "joi";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";

const schema = joi.object({
  username: joi.string().min(6).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("BODY:", body);

    const { error, value } = schema.validate(body);
    if (error) {
      return Response.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const { username, email, password } = value;
    const hashed = await bcrypt.hash(password, 10)
    await pool.query("insert into users(username, email, password) values($1, $2, $3)",[username, email, hashed])
    
    return Response.json(
      { message: "User Created" },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("SIGNUP ERROR:", e);
    return Response.json(
      { message: "User already exists or server error" },
      { status: 400 }
    );
  }
}
