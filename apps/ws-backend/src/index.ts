import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken'
import {JWT_SECRET} from '@repo/common/jwtSecret'

const wss = new WebSocketServer({port:8080});

wss.on("connection",function(socket,request){

    const url = request.url;
    if(!url) {
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token')??"";
    
    const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload;

    if(!decoded||!decoded.id){
        socket.close();
        return
    }
    socket.on("open",()=>{
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
