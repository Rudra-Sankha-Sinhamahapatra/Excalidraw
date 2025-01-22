import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({port:8080});

wss.on("connection",function(socket){
    console.log('ws://localhost:8080')
    socket.on("User connected",()=>{
     console.log("Connected")
    })
    socket.on('message',(e)=>{
        try {
            socket.send('hello')
        } catch (error) {
            console.log("Invalid message format ",error)
        }
    })
    
    socket.on("close",()=>{
        console.log("User Disconnected");
    })
})
