const todoModel = require("../model/todoModel")
const userModel = require("../model/userModel")
const nodemailer = require('nodemailer')


const {checkInputsPresent,isValid,isValidObjectId,Status,isBoolean} = require("../valid/valid")


const createtask= async function(req,res)
{
  try{
       if(!checkInputsPresent(req.body))
           return res.status(400).send({status: false,message: "Enter details"})

        const { userId,title,description,assignTo,createdBy,status,hasAlarm,alarmDate,alarmTime,dueDate} = req.body   
       
       
        if(!Status(status)) 
          return res.status(400).send({status:false,message:"Status is required it shoud be Completed/Pending "})  
            
        if(!isValidObjectId(userId))
          return res.status(400).send({ status: false, message: "Invalid UserId" })

        if(!isValid(userId))
          return res.status(400).send({ status: false, message: "UserId is required" })

        if(!isValid(title))
          return res.status(400).send({ status: false, message: "Title is required" })

        if(!isValid(description))
          return res.status(400).send({ status: false, message: "Description is required" })

        if(!isValid(assignTo))
          return res.status(400).send({ status: false, message: "Assign To is required" })
        
        if(!isValid(createdBy))
          return res.status(400).send({ status: false, message: "Created By is required" })
      
        if(!isValid(dueDate))
          return res.status(400).send({ status: false, message: "Due Date is required" })
         
        if(isBoolean(hasAlarm))        
          return res.status(400).send({ status: false, message: "Invalid Data it shoud be true/false" })         
      
 
      const reminderDate = new Date(`${alarmDate}T${alarmTime}`)
      const current = new Date()     
      if(reminderDate<current)     
        return res.status(400).send({ status: false, message: "Alram Date should be grester than Present Date" })     
        
      const ddate = new Date(dueDate)
      if(dueDate)
           {  if(ddate<current)     
                return res.status(400).send({ status: false, message: "Due Date should be grester than Present Date" })         
           }   
    

     let tododata= await todoModel.create(req.body)
  
     if(hasAlarm=="True" || hasAlarm=="true"){
   let userdata = await userModel.findById({_id:userId })    

    const mail=userdata.email
 
     const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'taskremainder4you@gmail.com',
        pass: 'T@skremainder'
      }
    })
    const mailOptions = {
      from: 'pritamsamaddar840@gmail.com',
      to: mail,
      subject: `Task reminder: ${title}`,
      text: `${description}\n\nDue date: ${dueDate}`
    }

    const reminderDate = new Date(`${dueDate}`)
    const now = new Date()
    const delay = reminderDate.getTime() - now.getTime()
    
    setTimeout(() => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error) 
          } else {
            console.log(`Email sent: ${info.response}`)
          }
        })
      }, delay) 
    
      }  return res.status(201).send({status:true,message:"Successful",data:tododata}) 
  }

  catch(err)
  {
    console.log(err)
    return res.status(500).send({status: false, message: err.message})
  }
}

const updatetask = async function(req,res)
{
try{ 
  taskId = req.query.taskId       
  const { userId,title,description,assignTo,createdBy,status,hasAlarm,alarmDate,alarmTime,dueDate } = req.body   
         
  if(!isValidObjectId(userId))
     return res.status(400).send({ status: false, message: "Please provide valid UserId"})

  if(!isValidObjectId(taskId))
     return res.status(400).send({ status: false, message: "Please provide valid Task Id"})

if (title || title === "")   
 { 
   if(!isValid(title))
     return res.status(400).send({ status: false, message: "title should be Required"})  
 }

 if (description || description === "")
 { 
   if(!isValid(description))
   return res.status(400).send({ status: false, message: "Description should be Required"})  
}
if (assignTo || assignTo === "")
{ 
  if(!isValid(assignTo))
  return res.status(400).send({ status: false, message: "Assign To should be Required"})
  
}
 
if (createdBy || createdBy === "")
{  if(!isValid(createdBy))
     return res.status(400).send({ status: false, message: "Sreated By is required"})
 
}
if (status || status === "")     
 { if(!isValid(status))
     return res.status(400).send({ status: false, message: "Status is required"})
 }

 if(!Status(status)) 
 return res.status(400).send({status:false,message:"Status is required it shoud be Completed/Pending "})  


if (dueDate || dueDate === "")
{ if(!isValid(dueDate))
     return res.status(400).send({ status: false, message: "Due Date Name is required"})
}

if (hasAlarm || hasAlarm === "")
{  
   if(!isValid(hasAlarm))
     return res.status(400).send({ status: false, message: "Alarm is required"})   
} 

if(isBoolean(hasAlarm))        
return res.status(400).send({ status: false, message: "Invalid Data it shoud be true/false" })         

const reminderDate = new Date(`${alarmDate}T${alarmTime}`)
      const current = new Date()

  if((alarmDate)||(alarmTime))
   {  if(reminderDate<current)     
        return res.status(400).send({ status: false, message: "Alram Date should be grester than Present Date" })         
   } 
   const ddate = new Date(dueDate)
if(dueDate)
   {  if(ddate<current)     
        return res.status(400).send({ status: false, message: "Due Date should be grester than Present Date" })         
   } 

  let update=await todoModel.findByIdAndUpdate({_id:taskId},{...req.body},{new:true})

  res.status(200).send({status:true,message:"Successfully Update",data:update})

}

catch(err)
{

   return res.status(500).send({ status: false, message: err.message })
}
}


const gettask= async function(req,res)
{
try{ 
 
  const {userId,status,hasAlarm,dueDate} = req.query  

    if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Enter Valid User Id" })

  if (status||hasAlarm||dueDate) {

      task = await todoModel.find({userId:userId, isDeleted: false }) 
     
      if(status)
      {  
         if(!Status(status)) 
        return res.status(400).send({status:false,message:"Status is required it shoud be Completed/Pending "})  
       
        task.filter((x)=>{x.status=status})
      }
      if(hasAlarm)
      {
        if(isBoolean(hasAlarm))        
            return res.status(400).send({ status: false, message: "Invalid Data it shoud be true/false" })         
        task.filter((x)=>{x.hasAlarm=hasAlarm})

      }
      if(status)
      {
        task.filter((x)=>{x.dueDate=dueDate})
      }

  if (task.length == 0) return res.status(404).send({ status: false, message: "Task Not Found." })
      return res.status(200).send({ status: true, message: "Successful", data: task })
  }

  let data=await todoModel.find({userId:userId, isDeleted: false})
  if (data.length == 0) return res.status(404).send({ status: false, message: "No Data Found" })
  res.status(200).send({ status: true, message: "Successful", data: data })

}
 
catch(err)
{
   return res.status(500).send({ status: false, message: err.message })
}
}

const completedTask= async function(req,res)
{
try{ 
  let userId = req.query.userId
  let stat="Completed"
    if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Enter Valid User Id" })
  
  let get=await todoModel.find({userId:userId, status:stat, isDeleted: false})

  res.status(200).send({status:true,message:"Done",data:get})

} 

catch(err)
{

   return res.status(500).send({ status: false, message: err.message })
}
}


const deleteTask = async function (req, res) {
  try {
      let taskId = req.query.taskId

      if (!isValidObjectId(taskId)) return res.status(400).send({ status: false, message: "Enter Valid Product Id" })
      let taskDetails = await todoModel.findOneAndUpdate({ _id: taskId, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
      if (!taskDetails) {
          return res.status(404).send({ status: false, message: "Task Not Found" })
      } else {
          return res.status(200).send({ status: true, message: "Task Successfully Deleted" })
      }
  }
  catch (err) { return res.status(500).send({ status: false, message: err.message }) }
}


module.exports={createtask, updatetask, gettask, deleteTask, completedTask}