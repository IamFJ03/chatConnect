"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export default function Login() {
    const {user, setUser} = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        })
        let data = null;
        try{
            data = await res.json();
        }
        catch{
            alert("Server error — no response body");
        return;
        }
        if (!res.ok) {
            console.log(data?.message);
            alert(data?.message);
            return
        }

        console.log("Status:", res.status);
        console.log("Message:", data?.message);
        console.log("data:", data?.userInfo);
        setUser(data?.userInfo);
        if(data?.message==="Login Successfull"){
            router.push("/dashboard")
        }
    }

    return (
        <div className="">
            <p className="flex justify-center text-xl">Sign in to Chat</p>
            <p className="flex justify-center ml-[5%] md:w-70 text-center mt-3 mb-7">Fast, secure, and real-time messaging at your fingertips.</p>
            <div className="ml-[10%]">
                <p className="text-lg my-3">Enter Email:</p>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border border-gray-600 px-3 py-1  w-70 rounded" required />
                <p className="text-lg my-3">Enter Password:</p>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border border-gray-600 px-3 py-1 w-70 rounded" required /><br />
                <button className="bg-gray-900 px-30 py-2 rounded cursor-pointer mt-5" onClick={handleLogin}>Login</button>
            </div>
        </div>
    )
}