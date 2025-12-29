
export default function Login(){
    return (
        <div className="">
            <p className="flex justify-center text-xl">Sign in to Chat</p>
            <p className="flex justify-center ml-[5%] md:w-70 text-center mt-3 mb-7">Fast, secure, and real-time messaging at your fingertips.</p>
            <div className="ml-[5%] md:ml-[10%]">
            <p className="text-lg my-3">Enter Email:</p>
            <input type="email" placeholder="Email" className="border border-gray-600 px-3 py-1 md:w-70 rounded" required/>
            <p className="text-lg my-3">Enter Password:</p>
            <input type="password" placeholder="Password" className="border border-gray-600 px-3 py-1 md:w-70 rounded" required/><br />
            <button className="bg-gray-900 px-30 py-2 rounded cursor-pointer mt-5">Login</button>
            </div>
        </div>
    )
}