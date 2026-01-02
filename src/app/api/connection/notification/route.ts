import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("s");
    
    console.log(query);
    if(!query)
        return Response.json({message:"User Id Required"},{status:400});

    return Response.json({message:"User Id Found", query},{status:200})
}