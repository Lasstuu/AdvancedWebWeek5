import {Request, Response, Router } from "express";
import fs from "fs";
import { ITodo, IUser, User } from "./models/User";


const router: Router = Router();

type TUser = {
    name: string,
    todos: string[]
}

let users: IUser[] = []


router.post("/add", async (req: Request, res: Response) => {
    const name: string = req.body.name;
    const todo: ITodo = {todo: req.body.todos};
    console.log(name, todo)
    try{
        const existingUser: IUser | null = await User.findOne({name: name});
        if(existingUser){
            res.json({message: "User already exists"})
            existingUser.todos.push(todo)
            await existingUser.save();
        }else{
            const user: IUser = new User({
                name: name,
                todos: [todo]
            })
            
            console.log(user)
            await user.save();
            res.status(201).json({message: "User saved successfully"})
        }
    }catch(error: any){
        console.error(`Error saving user: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
   
})

router.get("/todos/:id", async (req: Request, res: Response) => {
    const name = req.params.id;
    const user: IUser | null = await User.findOne({name: name});
    if(user) {
        res.send(user.todos)
    }else{
        res.send({
            message: "User not found"
        })
    }
})
router.delete("/delete", (req: Request, res: Response) => {
    const {name} = req.body;
    console.log(name)
    const user = users.find(u => u.name === name);
    if(user) {
        users.splice(users.indexOf(user), 1)
        
    }else{
        res.send("User not found")
    }
})

router.put("/update", async (req: Request, res: Response) => {
    const name: string = req.body.name;
    const todo: ITodo = {todo: req.body.todos};
    console.log(name, todo)
    try{
        const existingUser: IUser | null = await User.findOne({name: name});
        if(existingUser){
            existingUser.todos.splice(existingUser.todos.indexOf(todo))
            await existingUser.save();
        }else{
            res.send("User not found")
        }
    }catch(error: any){
        console.error(`Error saving user: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
})
export default router;