import {Request, Response, Router } from "express";
import fs from "fs";



const router: Router = Router();

type TUser = {
    name: string,
    todos: string[]
}

let users: TUser[] = []

fs.readFile("data.json", "utf-8", (err:NodeJS.ErrnoException | null, data: string) => {
    if(err){
        console.log(err)
        return
    }try{
        users = JSON.parse(data)
    }catch (error : any){
        console.error(`Error parsing JSON: ${error}`)
    }
})

router.post("/add", (req: Request, res: Response) => {
    const {name, todos} = req.body;
    console.log(name, todos)
    let user = users.find(u => u.name === name);
    if(user) {
        console.log("User already exists");
        user.todos.push(todos);
        console.log(user.todos)
    }else{
        const newUser : TUser= {name, todos: [todos]};
        users.push(newUser)
    }
    
    fs.writeFile("data.json", JSON.stringify(users), (err: NodeJS.ErrnoException | null) => {
        if(err){
            console.log(err)
        }
        res.send(`Todo added successfully for user ${name}`)
    })
   
})

router.get("/todos/:id", (req: Request, res: Response) => {
    const name = req.params.id;
    const user = users.find(u => u.name === name);
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
        fs.writeFile("data.json", JSON.stringify(users), (err: NodeJS.ErrnoException | null) => {
            if(err){
                console.log(err)
            }
            res.send("User deleted successfully")
        })
        
    }else{
        res.send("User not found")
    }
})

router.put("/update", (req: Request, res: Response) => {
    const {name, todo} = req.body;
    console.log(name, todo)
    const user = users.find(u => u.name === name);
    if(user) {
        user.todos.splice(user.todos.indexOf(todo), 1)
        fs.writeFile("data.json", JSON.stringify(users), (err: NodeJS.ErrnoException | null) => {
            if(err){
                console.log(err)
            }
            res.send("Todo deleted successfully")
        })
        
    }else{
        res.send("User not found")
    }
})
export default router;