const express = require('express');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = 'random';
const z = require('zod');
const app = express();
const {UserModel, TodoModel} = require('./db');
app.use(express.json());


// common syntax : UserModel.create , .findOne , .find
// always HASH YOUR PASSWORDS BEFORE SENDING IT TO THE DB.
// Main idea is only about userID , it should be signed by JWT and used to autheticate everywhere from todo , todos and it is generated at time of login by :

//const token = JWT.sign({userId:user._id.toString()},JWT_SECRET);

function auth(req,res,next){
    const token = req.headers.token;
    const decoded = JWT.verify(token,JWT_SECRET);
    
    if(decoded){

        req.userid = decoded.userid;
        
        next();
    }else{
        res.json({
            message : "invalid token"
        })
    }
}

app.post('/signup', async function(req, res) {
    //req.body
    // {
    //  username : string , password : string , name : string
    // }
    // INPUT VALIDATION


    const required = z.object({
        username : z.string().min(3).max(3).email(),
        password : z.string(),
        name : z.string()
    });
    
    const parseddata = required.safeparse(req.body);

    if(!parseddata.success){
        res.json({
            message : "invalid input",
            error : parseddata.error
        })
        return;
    }

    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;

    const HashedPassword = await bcrypt.hash(password,5);
    console.log(HashedPassword);

    await UserModel.create({
        username : username,
        password : HashedPassword,
        name : name
    });
        res.json({
        message : "you are signed up successfully"
    })
});

app.post("/login",async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;


    const user = await UserModel.findOne({username});
    console.log(user);

    if(!user){
        res.json({
            message : "User does not exist"
        })
        return;
    }
    const passmatch = await bcrypt.compare(password,user.password);

    if(passmatch && user){
        const token = JWT.sign({userid:user._id.toString()}, JWT_SECRET);
        res.json({
            message : "you are logged in successfully",
            token : token
        });
    }else{
        res.json({
            message : "invalid credentials"
        })
    }
});

app.post("/todo",auth,async function(req,res){
    const title = req.body.title;

    await TodoModel.create({
        title : title,
        done : false,
        userId: req.userid
    })

    res.json({
        message : "todo created"
    });
});

app.get("/todos",auth,async function(req,res){
    const todos = await TodoModel.find({userId:req.userid});
    res.json(todos);
});

app.listen(3000,()=>{
    console.log("server started");
})