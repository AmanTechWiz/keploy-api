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
    
    try {
        const decoded = JWT.verify(token,JWT_SECRET);
        
        if(decoded){
            req.userid = decoded.userid;
            next();
        }else{
            res.status(401).json({
                message : "invalid token"
            })
        }
    } catch (error) {
        res.status(401).json({
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
        username : z.string().min(3).email(),
        password : z.string().min(6),
        name : z.string().min(1)
    });
    
    const parseddata = required.safeParse(req.body);

    if(!parseddata.success){
        res.status(400).json({
            message : "invalid input",
            error : parseddata.error
        })
        return;
    }

    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;

    try {
        const existingUser = await UserModel.findOne({username});
        if(existingUser){
            res.status(400).json({
                message : "User already exists"
            })
            return;
        }

        const HashedPassword = await bcrypt.hash(password,5);
        console.log(HashedPassword);

        await UserModel.create({
            username : username,
            password : HashedPassword,
            name : name
        });
        
        res.status(201).json({
            message : "you are signed up successfully"
        })
    } catch (error) {
        res.status(500).json({
            message : "Internal server error"
        })
    }
});

app.post("/login",async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await UserModel.findOne({username});
        console.log(user);

        if(!user){
            res.status(404).json({
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
            res.status(401).json({
                message : "invalid credentials"
            })
        }
    } catch (error) {
        res.status(500).json({
            message : "Internal server error"
        })
    }
});

// Create Todo
app.post("/todo",auth,async function(req,res){
    const title = req.body.title;

    if(!title || title.trim() === ""){
        res.status(400).json({
            message : "Title is required"
        });
        return;
    }

    try {
        await TodoModel.create({
            title : title,
            done : false,
            userId: req.userid
        })

        res.status(201).json({
            message : "todo created"
        });
    } catch (error) {
        res.status(500).json({
            message : "Internal server error"
        })
    }
});

// Get all todos
app.get("/todos",auth,async function(req,res){
    try {
        const todos = await TodoModel.find({userId:req.userid});
        res.json(todos);
    } catch (error) {
        res.status(500).json({
            message : "Internal server error"
        })
    }
});

// Get single todo by ID
app.get("/todo/:id",auth,async function(req,res){
    const todoId = req.params.id;
    
    try {
        const todo = await TodoModel.findOne({_id: todoId, userId: req.userid});
        
        if(!todo){
            res.status(404).json({
                message : "Todo not found"
            });
            return;
        }
        
        res.json(todo);
    } catch (error) {
        res.status(500).json({
            message : "Internal server error"
        })
    }
});

// Update todo
app.put("/todo/:id",auth,async function(req,res){
    const todoId = req.params.id;
    const { title, done } = req.body;
    
    try {
        const todo = await TodoModel.findOne({_id: todoId, userId: req.userid});
        
        if(!todo){
            res.status(404).json({
                message : "Todo not found"
            });
            return;
        }
        
        const updateData = {};
        if(title !== undefined) updateData.title = title;
        if(done !== undefined) updateData.done = done;
        
        const updatedTodo = await TodoModel.findByIdAndUpdate(
            todoId, 
            updateData, 
            { new: true }
        );
        
        res.json({
            message : "todo updated successfully",
            todo: updatedTodo
        });
    } catch (error) {
        res.status(500).json({
            message : "Internal server error"
        })
    }
});

// Delete todo
app.delete("/todo/:id",auth,async function(req,res){
    const todoId = req.params.id;
    
    try {
        const todo = await TodoModel.findOne({_id: todoId, userId: req.userid});
        
        if(!todo){
            res.status(404).json({
                message : "Todo not found"
            });
            return;
        }
        
        await TodoModel.findByIdAndDelete(todoId);
        
        res.json({
            message : "todo deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message : "Internal server error"
        })
    }
});

app.listen(3000,()=>{
    console.log("server started");
})