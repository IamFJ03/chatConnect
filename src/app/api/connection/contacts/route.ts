import { NextRequest } from "next/server";
import { pool } from "@/lib/db";
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const searchId = searchParams.get("c");

    console.log("Search Id for Contacts:", searchId);
    const fetch = await pool.query(`select * from "MessagePermission" where ("senderId" = $1 or "recieverId" = $1) and status='accepted'`, [searchId]);
    if(fetch.rows.length === 0)
        return Response.json({message:"No Contacts Found"},{status:200});

    const contacts = fetch.rows;
    console.log("Contacts Fetched", contacts)
    return Response.json({ message: "Server Side Success", Contacts: contacts }, { status: 200 })
}