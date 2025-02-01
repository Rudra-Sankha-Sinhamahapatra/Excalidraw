import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/jwtSecret";
import prisma from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  rooms: string[];
  id: number;
}
const users: User[] = [];

function checkUser(token: string): number | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string" || !decoded || !decoded.id) {
      return null;
    }

    return Number(decoded.id);
  } catch {
    return null;
  }
}

wss.on("connection", async function (socket, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";

  const userId = checkUser(token);

  if (!userId || userId == null) {
    socket.send(
      JSON.stringify({
        type: "error",
        message: "empty userId detected. Closing socket.",
      })
    );
    socket.close();
    return null;
  }

  if (users.find((user) => user.id === userId)) {
    socket.send(
      JSON.stringify({
        type: "error",
        message: "Duplicate connection detected. Closing socket.",
      })
    );
    socket.close();
    return null;
  }

  users.push({
    socket: socket,
    id: userId,
    rooms: [],
  });

  socket.on("open", () => {
    console.log("Connected");
  });
  socket.on("message", async (data) => {
    try {
      const parsedData = JSON.parse(data as unknown as string);

      if (parsedData.type === "join_room") {
        const roomSlugOrId = parsedData.roomId;
        const user = users.find((x) => x.socket === socket);

        if (user) {
          let roomId = roomSlugOrId;
          // Check if the roomId is a slug and resolve it to the actual roomId (UUID)
          const room = await prisma.room.findFirst({
            where: {
              OR: [
                { id: roomSlugOrId }, // If it's already a UUID
                { slug: roomSlugOrId }, // If it's a slug
              ],
            },
          });

          if (!room) {
            socket.send(
              JSON.stringify({
                type: "error",
                message: `Room with ID or slug ${roomSlugOrId} does not exist.`,
              })
            );
            return;
          }

          // Now we have the actual roomId (UUID)
          roomId = room.id;

          if (!user.rooms.includes(roomId)) {
            user.rooms.push(roomId);
            console.log(`User ${userId} joined room ${roomId}`);
          } else {
            console.log(`User ${userId} is already in room ${roomId}`);
            socket.send(
              JSON.stringify({
                type: "error",
                message: `User ${userId} is already in room ${roomId}`,
                roomId,
              })
            );
          }
        } else {
          console.log(`User not found for socket ${socket}`);
        }
      }

      if (parsedData.type === "leave_room") {
        const roomId = parsedData.roomId;
        const user = users.find((x) => x.socket === socket);
        if (!user) {
          return;
        }
        user.rooms = user?.rooms.filter((x) => x !== roomId);
        console.log(`User ${userId} left room ${roomId}`);
      }

      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        if (message.length > 150) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: `Message too long, maximum size 150 characters`,
              roomId,
            })
          );
          return;
        }

        const user = users.find((user) => user.socket === socket);

        if (!userId) {
          return;
        }

        try {
        
          const roomExists = await prisma.room.findFirst({
            where :{
            OR: [
                { id: roomId }, 
                { slug:roomId }, 
              ],
            },
          });

          if (!roomExists) {
            socket.send(
              JSON.stringify({
                type: "error",
                message: `Room with ID ${roomId} does not exist.`,
              })
            );
            return;
          }

          const resolvedRoomID = roomExists.id;



          await prisma.chat.create({
            data: {
              roomId:resolvedRoomID,
              message,
              userId,
            },
          });

        if (!user || !user.rooms.includes(resolvedRoomID)) {
          console.log(`User ${userId} is not in room ${resolvedRoomID}.`);
          socket.send(
            JSON.stringify({
              type: "error",
              message: `User is not in room ${resolvedRoomID}`,
              roomId:resolvedRoomID,
            })
          );
          return;
        }

        // Broadcast the message to all users in the room
        users.forEach((user) => {
          if (user.rooms.includes(resolvedRoomID)) {
            user.socket.send(
              JSON.stringify({
                type: "chat",
                message: message,
                roomId:resolvedRoomID,
              })
            );
          }
        });
    } catch (error: any) {
        console.error("Error saving chat message:", error);
        socket.send(
          JSON.stringify({
            type: "error",
            message: "Failed to save chat message.",
            details: error.message,
          })
        );
        return;
      }
      }
    } catch (error) {
      console.log("Invalid message format ", error);
    }
  });

  socket.on("close", () => {
    console.log("User Disconnected");
    // Remove the user from the users array
    const index = users.findIndex((u) => u.socket === socket);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});
