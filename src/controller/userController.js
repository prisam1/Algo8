const userModel = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const {checkInputsPresent,isValid,isValidName,validateEmail,validPassword} = require("../valid/valid")


const registeruser= async function(req,res)
{
  try{
       if(!checkInputsPresent(req.body))
           return res.status(400).send({status: false,message: "Enter details"})

           let {name,email,password}=req.body     
  
        if(!isValid(name))
          return res.status(400).send({ status: false, message: "Name is required" })

        if(!isValidName(name))
          return res.status(400).send({ status: false, message: "Name Must be in Alphabets" })

        if(!isValid(email))
          return res.status(400).send({ status: false, message: "Email is required" })

        if(!validateEmail(email))
          return res.status(400).send({ status: false, message: "Enter Valid Email" })
        
        if(!isValid(password))
          return res.status(400).send({ status: false, message: "Password is required" })

        if(!validPassword(password))
          return res.status(400).send({ status: false, message: "1-UpperCase, 1-LowerCase, 1-Special, 1-Number, Minimum-8 Character" })
            
        let EmailUnique = await userModel.findOne({ email })
       
        if (EmailUnique) { return res.status(400).send({ status: false, message: "Email already exist" }) }

         req.body.password = await bcrypt.hash(req.body.password, 10)
    
     let userdata= await userModel.create(req.body)
          
       return res.status(201).send({status:true,Message:"Successful",data:userdata})    

  }

  catch(err)
  {
    console.log(err)
    return res.status(500).send({status: false, message: err.message})
  }


}

const loginUser = async function (req, res) {
  try {
    let data = req.body
    if (!checkInputsPresent(data))
      return res.status(400).send({ status: false, msg: "Email and Password is Requierd" })

    const { email, password } = data

    if (!email)
      return res.status(400).send({ status: false, msg: "Email is Requierd" })

    if (!password)
      return res.status(400).send({ status: false, msg: "Password is Requierd" })

    if (!validateEmail(email))
      return res.status(400).send({ status: false, msg: "Invalid Email Id" })

    let user = await userModel.findOne({ email })
    if (!user)
      return res.status(404).send({ status: false, msg: "User not Exist" })

    let Password = await bcrypt.compare(password, user.password)

    if (!Password)
      return res.status(400).send({ status: false, msg: "Incorrect password" })

    let token = jwt.sign({ userId: user._id, name:user.name }, "Algo8", {
      expiresIn: "2d",
    })
  
    return res.status(200).send({status: true, message: "User login successfully",
        data: { userId: user._id, name:user.name, token: token },
      })
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}
 
module.exports={registeruser,loginUser}

 

