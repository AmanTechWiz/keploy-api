const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectid = mongoose.ObjectId;
// url for db -> mongoose.connect("");

const User = new Schema({
    username: { type: String, unique: true },
    password: String,
    name: String
})

const Todo = new Schema({
    title:String,
    done:Boolean,
    userId:objectid
})

const UserModel = mongoose.model('users',User);
const TodoModel = mongoose.model('todo-collection',Todo);

module.exports = {
    UserModel: UserModel,
    TodoModel: TodoModel
};