"use client"
import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async () => {
        try{
            const res = await fetch("/api/auth/signup",{
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({username, email, password})
            })
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
                alert(data.message);
                return
            }
            console.log(res.status);
            console.log(data.message);
            setUsername("");
            setEmail("")
            setPassword("");
            
        }
        catch(e){

        }
    }
    return (
        <div className="">
            <p className="flex justify-center text-xl">Let's Get You Started!</p>
            <p className="flex justify-center ml-[5%] md:w-70 text-center mt-3 mb-7">Create an account and connect with people you care about.</p>
            <div className="ml-[10%]">
                <p className="text-lg my-3">Enter Username:</p>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="border border-gray-600 px-3 py-1 w-70 rounded" required />
                <p className="text-lg my-3">Enter Email:</p>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border border-gray-600 px-3 py-1 w-70 rounded" required />
                <p className="text-lg my-3">Enter Password:</p>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border border-gray-600 px-3 py-1 w-70 rounded" required /><br />
                <button className="bg-gray-900 px-28.5 py-2 rounded cursor-pointer mt-5" onClick={handleSignUp}>SignUp</button>
            </div>
        </div>
    )
}