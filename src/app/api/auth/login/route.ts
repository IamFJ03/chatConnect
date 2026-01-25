import joi from "joi";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // 🔥 REQUIRED

const schema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { error, value } = schema.validate(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const { email, password } = value;

    const search = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (search.rows.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 }
      );
    }

    const user = search.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      process.env.JWT_KEY!,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Login successful",
      userInfo: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
