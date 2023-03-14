const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span");
clearAll = document.querySelector(".clear-btn")
taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;

// getting localstorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    })
})
function showTodo(filter) {
    let li = "";
    if (todos) {
        // console.log(todos)
        todos.forEach((todo, id) => {
            // if todo status is completed, set the isCompleted value to checked.
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if (filter === todo.status || filter == "all") {
                li +=
                    `<li class="task">
                <label for="${id}">
                    <input onclick ="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                    <p class = ${isCompleted}>${todo.name}</p>
                </label>
                <div class="settings">
                    <i  onclick ="showMenu(this)" class="fa fa-cogs" aria-hidden="true"></i>
                    <ul class="task-menu">
                        <li onclick ="editTask(${id}, '${todo.name}')"><i class="uil uil-pen">Edit</i></li>
                        <li onclick ="deleteTask(${id})"><i class="uil uil-pen">Delete</i></li>
                    </ul>
                </div>
                </li>`;
            }
        });
    }
    // if li isnt empty, insert this value inside taskbox
    taskBox.innerHTML = li || `<span> you dont have task here`;
};
showTodo("all");
function showMenu(selectedTask) {
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {

        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
}
function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}
function deleteTask(deleteId) {
    // removing selected task from array/todos
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

clearAll.addEventListener("click", () => {
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
})

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        // updating the status of the task to be pending!
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditedTask) { // if isedited isnt true
            if (!todos) { // if todos isnt exist pass an empty array to todo
                todos = [];
            }
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo); // adding a new task to todo
        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");

    }
});  