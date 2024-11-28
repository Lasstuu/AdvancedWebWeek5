const submitBtn = document.getElementById("submit-data")
const deleteUserBtn = document.getElementById("deleteUser")
const form = document.getElementById("todoForm")
const deleteMessageElement = document.getElementById("deleteMessage")
form.addEventListener("submit", async function() {
    event.preventDefault()
    const formUser = document.getElementById("userInput").value
    const formTodo = document.getElementById("todoInput").value
    const messageElement = document.getElementById("message")
    console.log(formUser, formTodo)
    const data = await fetch("/add", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: formUser,
            todos: formTodo
        })
    })
    const messageText = await data.json()
    messageElement.textContent = messageText.message
})
const searchForm = document.getElementById("searchForm")
searchForm.addEventListener("submit", async function() {
    event.preventDefault()
    document.getElementById("todoList").textContent = ""
    const searchInput = document.getElementById("searchInput")
    const searchData = await fetch("/todos/" + searchInput.value)
    const searchDataJson = await searchData.json()
    const userSearchMsg = document.getElementById("userSearchMsg")
    userSearchMsg.textContent = ""
    deleteMessageElement.textContent = ""
    if (searchDataJson.message === "User not found") {
        userSearchMsg.textContent = searchDataJson.message
    }
    else{
        for (let i = 0; i < searchDataJson.length; i++) {
            const todoLiElement = document.createElement("li")
            const todoElement = document.createElement("a")
            todoElement.className = "delete-task"
            todoElement.textContent = searchDataJson[i]
            todoElement.href = "#"
            todoLiElement.appendChild(todoElement)
            document.getElementById("todoList").appendChild(todoLiElement)
            todoElement.addEventListener("click", async function() {
                event.preventDefault()
                const deleteTodo = await fetch("/update", {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "name": searchInput.value,
                        "todo": todoElement.textContent
                    })
                })
                const deleteMessageTodo = await deleteTodo.text()
                deleteMessageElement.textContent = deleteMessageTodo
                todoElement.parentElement.remove()
                
            })
        }
        deleteUserBtn.hidden = false
       
    }
    
})


deleteUserBtn.addEventListener("click", async function() {
    event.preventDefault()
    
    console.log(searchInput);
    const deleteData = await fetch("/delete",{
        method: "delete",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: searchInput.value
        })
    })
    const deleteMessage = await deleteData.text()
    deleteMessageElement.textContent = deleteMessage
    document.getElementById("todoList").textContent = ""
    deleteUserBtn.hidden = true
})
