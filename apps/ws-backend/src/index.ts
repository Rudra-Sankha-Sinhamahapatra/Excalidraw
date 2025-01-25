import { WebSocketServer,WebSocket } from "ws";
import jwt from 'jsonwebtoken'
import {JWT_SECRET} from '@repo/backend-common/jwtSecret'


const wss = new WebSocketServer({port:8080});


interface User {
socket:WebSocket,
rooms:string[],
id:string
}
const users : User[] = [];

function checkUser (token:string):string | null {
    try {
    const decoded = jwt.verify(token,JWT_SECRET);

    if(typeof decoded === 'string') {
        return null;
    }

    if(!decoded || !decoded.id) {
        return null;
    }

    return decoded.id;
} catch {
    return null;
}
}

wss.on("connection",function(socket,request){

    const url = request.url;
    if(!url) {
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token')??"";
    
    const userId = checkUser(token);

    if(!userId || userId==null){
        socket.send(JSON.stringify({
            type: 'error',
            message: 'empty userId detected. Closing socket.',
        }));
        socket.close();
        return null;
    }

    if(users.find(user=>user.id === userId)) {
        socket.send(JSON.stringify({
            type: 'error',
            message: 'Duplicate connection detected. Closing socket.',
        }));
        socket.close();
        return null;
    }

    users.push({
        socket:socket,
        id:userId,
        rooms:[],
    });

    socket.on("open",()=>{
     console.log("Connected")
    })
    socket.on('message',(data)=>{
        try {
            const parsedData = JSON.parse(data as unknown as string);

            if (parsedData.type === "join_room") {
                const roomId = parsedData.roomId;
                const user = users.find(x => x.socket === socket);
            
                if (user) {
                    if (!user.rooms.includes(roomId)) {
                        user.rooms.push(roomId);
                        console.log(`User ${userId} joined room ${roomId}`);
                    } else {
                        console.log(`User ${userId} is already in room ${roomId}`);
                        socket.send(JSON.stringify({
                            type:'error',
                            message:`User ${userId} is already in room ${roomId}`,
                            roomId
                        }))
                    }
                } else {
                    console.log(`User not found for socket ${socket}`);
                }
            }
            
            if(parsedData.type === 'leave_room') {
                const roomId = parsedData.roomId;
                const user = users.find(x=>x.socket === socket);
                if(!user) {
                    return;
                }
                user.rooms = user?.rooms.filter(x=> x !==roomId);
                console.log(`User ${userId} left room ${roomId}`);
            }

            if (parsedData.type === 'chat') {
                const roomId = parsedData.roomId;
                const message = parsedData.message;
            
                if (message.length > 150) {
                    socket.send(JSON.stringify({
                        type: 'error',
                        message: `Message too long, maximum size 150 characters`,
                        roomId
                    }));
                    return;
                }
            
                const user = users.find((user) => user.socket === socket);
            
                if (!user || !user.rooms.includes(roomId)) {
                    console.log(`User ${userId} is not in room ${roomId}.`);
                    socket.send(JSON.stringify({
                        type: 'error',
                        message: `User is not in room ${roomId}`,
                        roomId
                    }));
                    return;
                }
            
                // Broadcast the message to all users in the room
                users.forEach(user => {
                    if (user.rooms.includes(roomId)) {
                        user.socket.send(JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId
                        }));
                    }
                });
            }
            
        } catch (error) {
            console.log("Invalid message format ",error)
        }
    })
    
    socket.on("close",()=>{
        console.log("User Disconnected");
           // Remove the user from the users array
           const index = users.findIndex(u => u.socket === socket);
           if (index !== -1) {
               users.splice(index, 1);
           }
    })
})
