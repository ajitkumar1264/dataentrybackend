const mongoose=require('mongoose');

const db=process.env.DB
mongoose.connect(db).then(()=>{
    console.log("Database connected")
}).catch((err)=>{
    console.log(err.message)
})