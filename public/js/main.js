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
            todos: formTodo,
            checked: false
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
            const checkBoxElement = document.createElement("input")
            const labelElement = document.createElement("label")
            const spanElement = document.createElement("span")
            checkBoxElement.type = "checkbox"
            checkBoxElement.id = "myCheckbox"
            checkBoxElement.className = "checkBoxes"
            todoElement.className = "delete-task"
            todoElement.textContent = searchDataJson[i].todo
            todoElement.href = "#"
            console.log("Todo" + searchDataJson[i].todo)
            spanElement.appendChild(todoElement)
            labelElement.appendChild(checkBoxElement)
            labelElement.appendChild(spanElement)
            todoLiElement.appendChild(labelElement)
            
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
                        "todo": todoElement.textContent,
                        "checked": checkBoxElement.value
                    })
                })
                const deleteMessageTodo = await deleteTodo.text()
                deleteMessageElement.textContent = deleteMessageTodo
                todoElement.parentElement.remove()
                
            })
            checkBoxElement.addEventListener("change", async function() {
                //event.preventDefault()
                console.log(checkBoxElement.checked);
                
                const updateCheckedTodo = await fetch("/updateTodo", {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "name": searchInput.value,
                        "todo": todoElement.textContent,
                        "checked": checkBoxElement.checked
                    })
                })
                const updateMessageTodo = await updateCheckedTodo.text()
                deleteMessageElement.textContent = updateMessageTodo
                

                
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
