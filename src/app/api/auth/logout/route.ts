export const runtime = "nodejs"

import { NextResponse } from "next/server";
export async function POST(){
try{

const res = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
    
    res.cookies.delete("auth_token")

    return res;
}
catch(e){
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
}
}