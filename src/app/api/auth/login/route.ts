import joi from "joi";
import bcrypt from "bcrypt";
import { pool } from "@/lib/db";

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
    const search = await pool.query("select * from users where email = $1",[email]);
    const user = search.rows[0];
    if(!user) return Response.json({message:"No User Found"},{status: 201})

    const match = await bcrypt.compare(password, user.password)

    if(!match) return Response.json({message:"Invalid Credentials"},{status:201})

    const userInfo = {
      id: user.id,
      username: user.username,
      password: user.password
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
