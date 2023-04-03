const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const TodoSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "User",
        required:true
    },
    title:{
        type: String,
        required: true
    }, 

    description:{
        type: String,
        required: true
    },
    assignTo:{
        type: String,
        required: true
    },
    createdBy:{
        type: String,
        required: true
    },        
    status:{
        type:String,
        enum: ["Completed", "Pending"],
        required: true,
        trim:true
    },     
    hasAlarm:{
        type:Boolean,
        required: true,
    },
    alarmDate:{
        type:Date
    },
    alarmTime:{
        type:String
    },
    dueDate:{
        type:Date,
        required: true,
    }, 
    isDeleted:{
        type:Boolean,
        default:false
    }
      
},{ timestamps: true })

module.exports = mongoose.model("Todo", TodoSchema)