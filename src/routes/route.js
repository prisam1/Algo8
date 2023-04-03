const express  = require("express")
const router =express.Router()
const {registeruser,loginUser} = require("../controller/userController")
const { createtask, updatetask, gettask, deleteTask,completedTask } = require("../controller/todoController")
const {authentication,authorization}=require('../middleware/auth')



router.post("/Register",registeruser)
router.post("/login",loginUser)
router.post("/CreateTask",authentication,createtask)
router.put("/UpdateTask",authentication,authorization,updatetask) 
router.get("/GetTask",authentication,authorization,gettask)
router.get("/CompletedTask",authentication,authorization,completedTask)
router.delete("/DeleteTask",authentication,authorization,deleteTask)



router.all("/*",(req,res)=>{res.status(400).send({status:false,message:"Invalid path params"})})

module.exports = router 