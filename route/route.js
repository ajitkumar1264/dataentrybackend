const express=require("express");
const { userpost, userget, singleuserget, useredit, deleteuser, userstatus, userExport } = require("../controllers/usersController");
const router= new express.Router();
const upload=require("../multerconfig/storageconfig")

//routes
//single in name is same as frontend image name
router.post("/user/register",upload.single("user_profile"),userpost)
router.get("/user/details",userget)
router.get("/user/:id",singleuserget)
router.put("/user/edit/:id",upload.single("user_profile"),useredit)
router.delete("/user/delete/:id",deleteuser)
router.put("/user/status/:id",userstatus)
router.get("/userexport",userExport)

module.exports=router
