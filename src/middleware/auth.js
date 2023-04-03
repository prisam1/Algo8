const jwt = require('jsonwebtoken')
const {isValidObjectId} = require("../valid/valid")
const userModel = require("../model/userModel")

const authentication = function (req, res, next) {
    try {
    
        let token = req.headers["token"]
        if (!token) {
            return res.status(401).send({ status: false, message: "No token found" })
        }
        jwt.verify(token, "Algo8", function (err, decodedToken) {
            if (err) {
                return res.status(401).send({ status: false, message: err.message })
            }
            req.decodedToken = decodedToken
            next()
        })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const authorization = async function(req, res,next){
    try{    
        const decoded = req.decodedToken
        const userId= req.query.userId
    
        if(userId)
        {
            if(!isValidObjectId(userId))
            return res.status(400).send({status:false,message:"Invalid userId given"})
            
            const user = await userModel.findById(userId)
            
            if(!user)
            return res.status(404).send({status:false,message:"userId not found !"})
    
            if(decoded.userId !== userId.toString())
            return res.status(403).send({status:false,message:"Unauthorised access"})
    
        }else
            return res.status(400).send({status:false,message:"User Id Required"})
    }catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
    next()
    
        }

        const authorise = async function (req, res, next) {
            try {
                let token = req.headers.authorization.slice(7)
          
                let decodedToken = jwt.verify(token, "Product Managemnet")
                if (!decodedToken) return res.status(401).send({ status: false, message: "token is not valid" })
                  data = req.params.userId
                var isValid = mongoose.Types.ObjectId.isValid(data)
                
                if (!isValid) return res.status(400).send({ status: false, message: "Enter Valid User Id" })
                let userData = await userModel.findById(data)
                if (!userData) { return res.status(404).send({ status: false, message: "user not found" }) }
                
                if (userData._id == decodedToken.userId) {
                    next()
                } else { return res.status(403).send({ status: false, message: 'NOT AUTHORISED USER' }) }
            }
            catch (error) {
                res.status(500).send({ message: error.message })
            }
          }
    
module.exports ={authentication,authorization}