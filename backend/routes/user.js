const express = require('express');
const userRouter = express.Router();
const zod = require("zod");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const signupSchema =  zod.object({
    name: zod.string(),
    email: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})
    
router.post('/signup', async (req,res)=>{
    const body = req.body;
    const {success} = signupSchema.safeParse(req.body)
    if(!success){
        return res.status(400).json({message: "Invalid Request"})


}
const existingUser = await User.findOne({
    username : req.body.username,
})
if (existingUser) {
        return res.status(400).json({message : "Username already exists"})
}

const user = await User.create({
    username : req.body.username,
    password : req.body.password,
    firstName : req.body.firstName,
    lastName : req.body.lastName,
})

const userId = user._id;

const toker = jwt.sign({
    userId
}, JWT_SECRET)

res.json({message : "User Created Successfully", token : token});

})




module.exports = userRouter;