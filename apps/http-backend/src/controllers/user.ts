import { Request, Response } from "express"
import { CreateRoomSchema, Signin, Signup } from "@repo/common/types"
import prisma from "@repo/db/client";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@repo/backend-common/jwtSecret";
import bcrypt from 'bcrypt'

export const signup = async(req:Request,res:Response):Promise<void>=>{
try {
   const result = Signup.safeParse(req.body);
   if(!result) {
    res.status(400).json({
        message:"Wrong inputs,zod validation failed"
    })
    return
   }

   const newUser = result.data;

   if(!newUser){
    res.status(404).json({
     message:"Details are not enough"
    })
    return
    }

    
   const exisitingUser = await prisma.user.findFirst({
    where:{
        email:newUser?.email
    }
   })

   if(exisitingUser) {
    res.status(409).json({
        message:"User already exists"
    })
    return
   }

   const hashedPassword = await bcrypt.hash(newUser.password,10);

   const User = await prisma.user.create({
    data:{
        email:newUser?.email,
        password:hashedPassword,
        name:newUser?.name
    }
   })

   const token = jwt.sign({id:User.id}, JWT_SECRET)

   res.status(200).json({
    message:"User Signed Up Successfully",
    token,
    User
   })
} catch (error:any) {
    console.log("Error: ",error.message);
}
}

export const signin = async(req:Request,res:Response):Promise<void>=>{
    try {
       const result = Signin.safeParse(req.body);
       if(!result) {
        res.status(400).json({
            message:"Wrong inputs,zod validation failed"
        })
        return
       }
    
       const oldUser = result.data;

       if(!oldUser){
        res.status(404).json({
         message:"Details are not enough"
        })
        return
        }

       const exisitingUser = await prisma.user.findFirst({
        where:{
            email:oldUser?.email
        }
       })
    
       if(!exisitingUser) {
        res.status(409).json({
            message:"User doesn't exists"
        })
        return
       }
    
      const comparedPassword = await bcrypt.compare(exisitingUser.password,oldUser.password);

      if(!comparedPassword){
        res.status(400).json({
            message:"Passwords are not same"
        })
        return
      }
    
       const token = jwt.sign({id:exisitingUser.id}, JWT_SECRET)
    
       res.status(200).json({
        message:"User Signed In Successfully",
        token,
        exisitingUser
       })
       return
    } catch (error:any) {
        console.log("Error: ",error.message);
    }
    }

    export const createRoom = async(req:Request,res:Response):Promise<void> => {
      const parsedData = CreateRoomSchema.safeParse(req.body);

      if(!parsedData.success) {
        res.status(411).json({
            message:"Incorrect inputs"
        })
        return
      }

      const userId = parseInt(req.id as string,10);

      if(isNaN(userId)){
        res.status(400).json({
            message:"Invalid user Id"
        })
        return
      }

      try {
        const existingRoom = await prisma.room.findUnique({
            where:{
                slug:parsedData.data.name
            }
        })

        if(existingRoom) {
            res.status(400).json({
                message:"Room already exists with the same name"
            })
            return
        }
        
        const room = await prisma.room.create({
            data:{
                slug:parsedData.data.name,
                adminId:userId
            }
        })

        res.status(200).json({
            roomId:room.id,
            room
        })
        return
      } catch (error:any) {
        console.log(error.message);
        res.status(500).json({
            message:"Internal Server Error"
        })
        return
      }
    }