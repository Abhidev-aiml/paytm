const mongoose = require('mongoose'); 

// Connection to MongoDB Atlas
mongoose.connect('')

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        minLength : [6],
        maxLength : [30],
        unique:true,
        lowercase:true,
        trim:true,
    },
    password : {
        type : String,
        required : true,
        minLength : [6],
    },
    firstName : {
        type : String,
        required : true,
        trim: true,
        maxLength : [30]
    },
    lastName : {
        type : String,
        required : true,
        trim: true,
        maxLength : [30]
    }
})

const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true,

}, balance : {
        type : Number,
        required : true,
    }
})

const Account = mongoose.model('Account', accountSchema)
const User = mongoose.model('User', userSchema);

module.export = {
    User,
    Account,
}