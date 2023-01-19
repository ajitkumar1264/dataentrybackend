const mongoose=require('mongoose');

const db="mongodb+srv://meshohack:paas1264@mesho.1umopoj.mongodb.net/MERN_2"
mongoose.connect(db).then(()=>{
    console.log("Database connected")
}).catch((err)=>{
    console.log(err.message)
})