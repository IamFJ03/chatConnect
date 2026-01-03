export default function ChatScreen(){
    return (
        
            <div className="flex flex-col w-full">
                <div className="flex-1"><p>ChatScreen</p></div>
                
                <div className="flex w-full">
                <input type="text" placeholder="Type Message..." className="border border-gray-600 px-3 py-1.5 rounded flex-1"/>
                <button className="bg-gray-800 py-1.5 px-3 rounded cursor-pointer">Send</button>
                </div>
            </div>
    )
}