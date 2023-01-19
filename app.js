require("dotenv").config();
const express= require("express")
const app=express()
require("./db/connect")
const cors=require("cors")
const PORT=process.env.PORT||4565
const router=require("./route/route")

app.use(cors())
app.use(express.json())
app.use("/uploads",express.static("./uploads"))
app.use(router)
app.use("/files",express.static("./public/files"))


app.get("/",(req,res)=>{
    res.status(200).json("server work correctly")
})

app.listen(PORT,()=>{
    console.log(`server listening on ${PORT}`)
})