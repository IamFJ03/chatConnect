import joi from "joi";
import bcrypt from "bcrypt";
import { pool } from "@/lib/db";

const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
})

export async function POST(req: Request) {

        const body = await req.json();
        if (body.email === "" || body.password === "") return Response.json({ message: "All Fields required" }, { status: 400 })

        const { error, value } = schema.validate(body);

        if (error) {
            console.log("Error")
            return Response.json({ message: error.details[0].message }, { status: 400 })
        }
        const { email, password } = value;

        console.log(email, password)
        const search = await pool.query("Select * from users where email = $1",[email]);
        if(search.rows.length===0) return Response.json({message:"User not Found"},{status:401});
        const user = search.rows[0]
        const match = await bcrypt.compare(password, user.password);
        if(!match) return Response.json({message:"Invalid Credentials"},{status: 401});
        
        const userInfo = {
            id: user.id,
            username: user.username,
            email: user.email,
        }
        return Response.json({ message: "Login Successfull", userInfo: userInfo }, { status: 200 })
}