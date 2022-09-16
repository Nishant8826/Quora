const express=require("express")
const router=express.Router()
const user=require("../controllers/user")
const mid=require("../middlewares/auth")

router.post("/register",user.createUser)
router.post("/login",user.login)
router.get("/user/:userId/profile",mid.authentication,user.getById)
router.put("/user/:userId/profile",mid.authentication,user.updateUser)

module.exports=router