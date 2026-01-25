export const runtime = "nodejs"
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if(!token)
        return NextResponse.json({message:"Unauthorized"},{status: 401})

    const user = jwt.verify(token, process.env.JWT_KEY!);

    return NextResponse.json({user})
}