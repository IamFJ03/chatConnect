import { pool } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){
    const searchParams = await req.nextUrl.searchParams;
    const query = searchParams.get("s");

    const find = await pool.query(`select * from "MessagePermission" where ("senderId"=$1 or "recieverId"=$1) and status='accepted'`,[query]);
    if(find.rows.length>0) return Response.json({message:"Message Accepted"},{status:200})

    return Response.json({message:"Message not been sent or accepted"},{status:200})
}

export async function POST(req: Request) {
    const body = await req.json();
    console.log(body);

    let update;
    if (body.status === "accept") {
        update = await pool.query(`update "MessagePermission" set status='accepted' where id=$1 and status='pending' returning *`, [body.id]);
        return Response.json({ message: "Update Succesfull", newNotifications: update.rows[0] }, { status: 200 })
    }

    else if (body.status === "reject") {
        update = await pool.query(`delete from "MessagePermission" where id=$1 returning *`, [body.id]);
        return Response.json({message:"Request Deleted", newNotifications: update.rows[0]},{status:200})
    }
    return Response.json({ message: "There might be some issue during database Access" }, { status: 200 })
}