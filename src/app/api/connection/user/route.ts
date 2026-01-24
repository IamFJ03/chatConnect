import { pool } from "@/lib/db";
import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("s");
    console.log(query);
    const search = await pool.query("select * from users where username = $1", [query]);

    if (search.rows.length === 0) return Response.json({ message: "User Not Found" }, { status: 400 })

    const user = search.rows[0];
    console.log("User", user)
    return Response.json({
        message: "User Found",
        data: user
    }, { status: 200 })
}

export async function POST(req: Request) {
    const body = await req.formData();
    const file = body.get("profilePicture") as File;
    const username = body.get("username") as String;
    if (!file) {
        return Response.json({ message: "No file uploaded" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, buffer);

    const update = await pool.query(`Update users Set "profilePicture" = $1 where username = $2`, [`/uploads/${filename}`, username]);

    console.log(update.rows[0]);
    return Response.json({ message: "Succesfully got image" }, { status: 200 })
}