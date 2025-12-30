"use client"

import { useState } from "react";
import Login from "@/app/components/login"
import Signup from "@/app/components/SignUp"

export default function Authentication() {
    const [isLogin, setIsLogin] = useState(false);
    return (
        <div className="flex h-screen items-center justify-center">
            <div>
                <div className="flex justify-center">
                    <button className={`bg-gray-800 py-2 px-7 rounded-tl cursor-pointer ${isLogin && 'scale-115 border-t border-l border-r rounded-t border-white'} transition-all duration-500`} onClick={() => setIsLogin(true)}>Login</button>
                    <button className={`bg-gray-800 px-7 rounded-tr cursor-pointer ${!isLogin && 'scale-115 border-t border-l border-r rounded-t'} transition-all duration-500`} onClick={() => setIsLogin(false)}>SignUp</button>
                </div>
                <div className="h-fit md:w-90 w-[90%] pt-7 pb-15 bg-gray-800 rounded-xl border border-white ml-[5%] md:ml-0">
                    {isLogin
                        ?
                        <Login />
                        :
                        <Signup />
                        }
                </div>

            </div>
        </div>
    )
}