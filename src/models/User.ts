import mongoose, { Document, Schema} from "mongoose";

interface ITodo {
    todo: string;
}

interface IUser extends Document {
    name: string;
    todos: ITodo[];
}

let todoSchema: Schema = new Schema({
    todo: {type: String, required: true}
})

let todoUser: Schema = new Schema({
    name: {type: String, required: true},
    todos: {
        type: [todoSchema],
        required: true
    }
})