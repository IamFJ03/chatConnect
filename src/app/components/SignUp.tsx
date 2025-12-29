
export default function Login(){
    return (
        <div className="">
            <p className="flex justify-center text-xl">Let’s Get You Started!</p>
            <p className="flex justify-center ml-[5%] md:w-70 text-center mt-3 mb-7">Create an account and connect with people you care about.</p>
            <div className="ml-[5%] md:ml-[10%]">
                <p className="text-lg my-3">Enter Username:</p>
            <input type="text" placeholder="Username" className="border border-gray-600 px-3 py-1 md:w-70 rounded" required/>
            <p className="text-lg my-3">Enter Email:</p>
            <input type="email" placeholder="Email" className="border border-gray-600 px-3 py-1 md:w-70 rounded" required/>
            <p className="text-lg my-3">Enter Password:</p>
            <input type="password" placeholder="Password" className="border border-gray-600 px-3 py-1 md:w-70 rounded" required/><br />
            <button className="bg-gray-900 px-28.5 py-2 rounded cursor-pointer mt-5">SignUp</button>
            </div>
        </div>
    )
}