import joi from "joi";

const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
})

export async function POST(req: Request){
    const body = await req.json();
    if(body.email === "" || body.password==="") return Response.json({message:"All Fields required"},{status:400})

    const {error, value} = schema.validate(body);

    if(error) {
        console.log("Error")
        return Response.json({message:error.details[0].message},{status:400})
    }
    const {email, password} = value;
    
    console.log(email,password)
    return Response.json({message:"Login Successfull"},{status: 200})
}