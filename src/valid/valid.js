const mongoose = require('mongoose');


const checkInputsPresent = (value) => {
    return (Object.keys(value).length > 0);
}

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length == 0) return false
    return true
}

const isValidName = function(name){
    return /^[a-zA-Z\s]{2,20}$/.test(name.trim())
    }

const validateEmail = (email) => {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()));
}

const validPassword=(password)=>{
return (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{8,15}$/.test(password))
}
const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId) 
}

const Status= function(value){
    if (value == "Completed" || value =="Pending") return true
    return false
}

function isBoolean(val)
     {
         if (val === true || val === false  )
         return true 
      
         return false 
     }


module.exports={checkInputsPresent,isValid,isValidName,validateEmail,validPassword,isValidObjectId,Status,isBoolean}