import { Request, Response } from "express"
import { Signin, Signup } from "@repo/common/zod"
import prisma from "@repo/db/client";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@repo/common/jwtSecret";
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

    export const Room = async(req:Request,res:Response):Promise<void> => {
      
    }