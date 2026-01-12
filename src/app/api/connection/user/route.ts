import { pool } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("s");
    console.log(query);
    const search = await pool.query("select * from users where username = $1",[query]);

    if(search.rows.length===0) return Response.json({message:"User Not Found"},{status:400})
    
        const user = search.rows[0];
    return Response.json({
        message: "User Found",
        data: user
    },{status:200})
}

export async function POST(req: Request){
    const body = await req.formData();
    const file = body.get("profilePicture") as File;

    console.log(file)
    return Response.json({message:"Succesfully got image"},{status:200})
}