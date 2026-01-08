import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const searchId = searchParams.get("c");

    console.log("Search Id for Contacts:", searchId);
    return Response.json({ message: "Server Side Success" }, { status: 200 })
}