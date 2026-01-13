import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(){
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if(!token)
        return Response.json({message:"Unauthorized"},{status: 401})

    const user = jwt.verify(token, process.env.JWT_KEY!);

    return Response.json({user})
}