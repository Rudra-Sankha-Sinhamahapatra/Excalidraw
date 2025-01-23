import { JWT_SECRET } from "@repo/backend-common/jwtSecret";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'


export function middleware(req:Request,res:Response,next:NextFunction) {
    const token = req.headers["authorization"]??"token";

    const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload

    if(decoded){
        req.id = decoded.id;
        next()
    } else {
        res.status(403).json({
            message:"UnAuthorized"
        })
        return
    }
}