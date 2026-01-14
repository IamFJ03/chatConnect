import { cookies } from "next/headers";

export async function POST(){
try{
const cookieStore = await cookies();
cookieStore.delete("auth_token");

return Response.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
}
catch(e){
    return Response.json(
      { message: "Logout failed" },
      { status: 500 }
    );
}
}