"use client";

import { useEffect, useState } from "react";
import { use } from "react";  // Import 'use' from React
import { getRoom } from "../../../actions/getRoom";
import { ChatRoom } from "../../../components/ChatRoom";
import { BACKEND_URL } from "../../../lib/config";

export default function ChatRoomPage({
    params
}: {
    params: Promise<{ slug: string }>;  // params is now a Promise
}) {
    const { slug } = use(params);  // Unwrap the Promise using React's 'use' function

    const [roomId, setRoomId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchRoom() {
            console.log(BACKEND_URL);
            console.log('Slug:', slug);

            const id = await getRoom(slug);
            setRoomId(id);
            setLoading(false);
        }

        fetchRoom();
    }, [slug]);

    if (loading) {
        return <div>Loading room...</div>;
    }

    if (!roomId) {
        return <div>Room not found.</div>;
    }

    return <ChatRoom id={roomId} />;
}
