import { NextRequest } from "next/server";
import { pool } from "@/lib/db";
export async function GET(req: NextRequest){
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("s");
    
    console.log(query);
    if(!query)
        return Response.json({message:"User Id Required"},{status:400});
    
    const fetchDetails = await pool.query(`select * from "MessagePermission" where "recieverId" = $1`,[query]);
    if(fetchDetails.rows.length === 0) return Response.json({message:"No New Notifications"},{status:400});

    console.log("Notification:", fetchDetails);
    return Response.json({message:"Notifications found", notifications:fetchDetails},{status:200})

    
}