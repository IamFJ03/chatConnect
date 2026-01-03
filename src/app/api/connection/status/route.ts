import { pool } from "@/lib/db";

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