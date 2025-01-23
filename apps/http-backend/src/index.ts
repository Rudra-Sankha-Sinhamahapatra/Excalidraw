import express,{Request,Response} from 'express'
import userRouter from './routes/user'
import cors from 'cors'

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors())

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        msg:"All Good"
    })
    return
})

app.use("/api/user",userRouter);

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}\n, Server Started at PORT ${PORT}`)
})