"use client"
import { ChatRoomClient } from "./ChatRoomClient";
import { getChats } from "../actions/getChats";
import { useEffect, useState } from "react";


export  function ChatRoom ({id}:{id:string}) {
        console.log(id)
        const [messages, setMessages] = useState<{ message: string }[]>([]);
        const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChats() {
            const chats = await getChats(id);
            setMessages(chats);
            setLoading(false);
        }

        fetchChats();
    }, [id]);

    if (loading) {
        return <div>Loading chats...</div>;
    }


    return <ChatRoomClient messages={messages} id={id}/>
  
}