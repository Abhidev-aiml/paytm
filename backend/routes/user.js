const express = require('express');
const userRouter = express.Router();
const zod = require("zod");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const {authMiddleware} = require('../middlewares')

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

await Account.create({
    userId, balance : 1 + Math.random() * 10000
})

const token = jwt.sign({
    userId
}, JWT_SECRET)

res.json({message : "User Created Successfully", token : token});

})


const updateBody = zod.object({
    password: zod.string().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional()
})

router.put('/update', authMiddleware, async (req, res) => {
    const {success} = updateBody.safeParse(req.body);

    if(!success) {
        return res.status(400).json({message: "Invalid Request"})

    }

    await User.updateOne(req.body,{
        id: req.userId
    })

    res.json({message : "User Updated Successfully"})
    })



    router.get('/bulk', async (req, res) => {
       const filter = req.query.filter || "";

       const users = await User.find({
        $or : [{
            firstName : { $regex : filter }
        }, {
            lastName : { $regex : filter }
        }]
       })

        res.json({
            user: users.map(user=>({
                username : user.username,
                firstName : user.firstName,
                lastName : user.lastName,
                id : user._id
            }))
        })
    })
module.exports = userRouter;