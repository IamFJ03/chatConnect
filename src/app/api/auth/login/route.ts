import joi from "joi";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const schema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required()
})

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email || !body.password) {
      return Response.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const { error, value } = schema.validate(body);
    if (error) {
      return Response.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const { email, password } = value;
    console.log(email, password)
    const search = await pool.query("select * from users where email = $1", [email]);

    if (search.rows.length === 0) return Response.json({ message: "User not Found" }, { status: 201 })

    const user = search.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) return Response.json({ message: "Invalid Credentials" }, { status: 201 });

    const token = jwt.sign({id: user.id, username: user.username, email: user.email, profilePicture:user.profilePicture}, process.env.JWT_KEY!, {expiresIn: "7d"});

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60*60*24*7
    });

    

    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture
    }
    return Response.json(
      {
        message: "Login Successfull",
        userInfo: userInfo
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
