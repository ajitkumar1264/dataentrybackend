const users = require("../models/userschema");
const moment =require("moment")
const csv=require("fast-csv")
const fs=require("fs")

exports.userpost = async (req, res) => {
  const file = req.file.filename;
  const { fname, lname, email, mobileno, gender, location, status } = req.body;

  if (
    !fname ||
    !lname ||
    !email ||
    !mobileno ||
    !gender ||
    !location ||
    !status ||
    !file
  ) {
    res.status(401).json("All Input is required");
  }

  try {
    const preuser = await users.findOne({ email: email });
    if (preuser) {
      res.status(401).json("this user is already exits in our database");
    } else {

      const datecreated=moment(new Date()).format("YYYY-MM-DD hh:mm:ss")

      const userdata = new users({
        fname,
        
        lname,
        email,
        mobileno,
        gender,
        location,
        status,
        profile: file,
        datecreated
      });

     await userdata.save();
     res.status(200).json(userdata);

    }
  } catch (err) {


    res.status(401).json(err);
    console.log(err);

  }
};
///user get data

exports.userget=async(req,res)=>{

  const search=req.query.search || ""
  const gender=req.query.gender || ""
  const status=req.query.status || ""
  const sort=req.query.sort || ""
  const page=req.query.page || 1
  const item_per_page=4
  

  const query={
    fname:{$regex:search,$options:"i"}
  }

  if(gender !== "All")
  {
    query.gender=gender
  }
  if(status!=="All")
  {
    query.status=status
  }

  try{

    console.log(req.query)
    const skip=(page-1)*item_per_page //0*4=0 or 1*4=4
    const count=await users.countDocuments(query)
    console.log(count)

    const usersdata=await users.find(query).sort({datecreated:sort == "new" ?-1 :1}).limit(item_per_page).skip(skip);
    
    const pagecount=Math.ceil(count/item_per_page) //  8/4=2


    res.status(200).json({pagination:{
      count,pagecount
    },usersdata})

  } catch(error)
  {
    res.status(401).json(error)
  }

}
///single user get

exports.singleuserget=async(req,res)=>{

   const {id}=req.params;

  try{

const userdata=await users.findOne({_id:id})
res.status(200).json(userdata)

  } catch(error)
  {
    res.status(401).json(error)
  }
}

///user edit

exports.useredit=async(req,res)=>{

  const {id}=req.params;
  const { fname, lname, email, mobileno, gender, location, status,user_profile } = req.body;
  const file=req.file ? req.file.filename :user_profile

  const dateupdated=moment(new Date).format("YYYY-MM-DD hh:mm:ss")
  try{

    const updateuser=await users.findByIdAndUpdate({_id:id},{

      fname,
      lname,
      email,
      mobileno,
      gender,
      location,
      status,
      profile: file,
      dateupdated

    },{
      new:true
    })

    await updateuser.save();
    res.status(200).json(updateuser);

  } catch(error)
  {
    res.status(401).json(error)
  }

}

///delete user

exports.deleteuser=async(req,res)=>{
  const {id}=req.params

  try{

    const deleter=await users.findByIdAndDelete({_id:id})
    res.status(200).json(deleter)

  } catch(error)
  {
    res.status(404).json(error)
  }
}

/// change the user status

exports.userstatus=async(req,res)=>{
  const {id}=req.params

  const {data}=req.body

  try{

    const userstatusupdated= await users.findByIdAndUpdate({_id:id},{
      status:data
    },{new:true})

    res.status(200).json(userstatusupdated)

  }
   catch(error)
   {
     res.status(404).json(error)
   }
}

//export user

exports.userExport=async(req,res)=>{

  try{

    const userdata= await users.find()
    const csvStream=csv.format({headers:true});

    if(!fs.existsSync("public/files/export"))
    {
      if(!fs.existsSync("public/files"))
      {
        fs.mkdirSync("public/files/")
      }
      if(!fs.existsSync("public/files/export"))
      {
        fs.mkdir("./public/files/export")
      }
    }

    const writablestream=fs.createWriteStream(
      "public/files/export/users.csv"
    )

    csvStream.pipe(writablestream)

    writablestream.on("finish",function(){
      res.json({
        downloadurl:`https://localhost:4565/files/export/user.csv`
      })
    })

    if(userdata.length >0 )
    {
      userdata.map((users)=>{
        csvStream.write({
          firstname:users.fname ? users.fname :"-",
          lastname:users.lname ? users.lname : "-",
          email:users.email ? users.email : "-",
        mobileno:users.mobileno ? users.mobileno : "-",
        gender:users.gender ? users.gender : "-",
        location:users.location ? users.location : "-",
        profile:users.profile ? users.profile : "-",
        datecreated:users.datecreated ? users.datecreated : "-",

        })
      })
    }

    csvStream.end();
    writablestream.end();

  } catch(error)
  {
    res.status(401).json(error)
  }


}