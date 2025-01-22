import express,{Request,Response} from 'express'

const app = express();
const PORT = 3002;

app.use(express.json());

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        msg:"All Good"
    })
    return
})

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}\n, Server Started at PORT ${PORT}`)
})