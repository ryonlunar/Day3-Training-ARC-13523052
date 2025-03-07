const addBtn = document.querySelector('.add-btn');
const addTodoBtn = document.querySelector('.add-todo-btn');
const cancelTodoBtn = document.querySelector('.cancel-todo-btn');
const modalContainer = document.querySelector('.modal-container');
const addTodoModalContainer = document.querySelector('.add-todo-modal-container');
const editTodoModalContainer = document.querySelector('.edit-todo-modal-container');
const editTodoBtn = document.querySelector('.edit-btn');
const cancelEditBtn = document.querySelector('.cancel-edit-todo-btn');

const API_URL  = "/tasks";


async function fetchTasks(searchQuery = "") {
    const response = await fetch(API_URL);
    let tasks = await response.json();

    tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    tasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed - b.completed;
        }
        return new Date(a.deadline) - new Date(b.deadline);
    });
    
    const taskContainer = document.querySelector('.todo-list-content');
    taskContainer.innerHTML = '';

    if (tasks.length === 0) {
        taskContainer.innerHTML = `
            <div class="no-task">
                <h1>No Task Avaliable.</h1>
            </div>
        `;
        return;
    }

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        const truncatedTitle = task.title.length > 25 ? task.title.slice(0, 25) + "..." : task.title;
        const truncatedDescription = task.description.length > 35 ? task.description.slice(0, 35) + "..." : task.description;

        taskItem.classList.add(task.completed ? 'todo-list-item-checked' : 'todo-list-item');
        taskItem.innerHTML = `
            <div class="todo-list-title">
                <h2 class="task-view" data-id="${task.id}">${truncatedTitle}</h2>
                <p class="task-view" data-id="${task.id}">${truncatedDescription}</p>
                <small>Deadline: ${task.deadline}</small>
            </div>
            <div class="todo-list-btn">
                <button onclick="toggleTask(${task.id})" class="check-btn">
                    ${task.completed ? 'Uncheck' : 'Check'}
                </button>
                <button onclick="openEditModal(${task.id})" class="edit-btn">Edit</button>
                <button onclick="deleteTask(${task.id})" class="delete-btn">Delete</button>
            </div>
        `;

        taskItem.querySelectorAll(".task-view").forEach(element => {
            element.addEventListener("click", (e) => {
                const taskId = e.target.getAttribute("data-id");
                openViewModal(taskId);
            });
        });

        taskContainer.appendChild(taskItem);
    });
}

document.querySelector(".add-todo-btn").addEventListener("click", async () => {
    const title = document.querySelector(".task-title").value;
    const description = document.querySelector(".task-description").value;
    const deadline = document.querySelector(".task-deadline").value;

    if (!title || !deadline) {
        alert("Title and deadline are required!");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, deadline })
    });

    document.querySelector(".task-title").value = "";
    document.querySelector(".task-description").value = "";
    document.querySelector(".task-deadline").value = "";

    document.querySelector(".add-todo-modal-container").style.display = 'none';
    document.querySelector(".modal-container").style.visibility = 'hidden';
    document.querySelector(".modal-container").style.opacity = '0';
    
    fetchTasks();
});

async function openEditModal(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const task = await response.json();

    document.querySelector(".edit-task-title").value = task.title;
    document.querySelector(".edit-task-description").value = task.description;
    document.querySelector(".edit-task-deadline").value = task.deadline;
    document.querySelector(".edit-todo-btn").setAttribute("data-id", id);

    document.querySelector(".edit-todo-modal-container").style.display = 'block';
    document.querySelector(".modal-container").style.visibility = 'visible';
    document.querySelector(".modal-container").style.opacity = '1';
}

document.querySelector(".edit-todo-btn").addEventListener("click", async () => {
    const id = document.querySelector(".edit-todo-btn").getAttribute("data-id");
    const title = document.querySelector(".edit-task-title").value;
    const description = document.querySelector(".edit-task-description").value;
    const deadline = document.querySelector(".edit-task-deadline").value;

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, deadline })
    });

    document.querySelector(".edit-todo-modal-container").style.display = 'none';
    document.querySelector(".modal-container").style.visibility = 'hidden';
    document.querySelector(".modal-container").style.opacity = '0';

    fetchTasks();
});

document.querySelector('.search-btn').addEventListener('click', async() => {
    const searchQuery = document.querySelector(".search-input").value;
    // console.log(searchQuery);
    fetchTasks(searchQuery);
});

document.querySelector(".search-input").addEventListener("keyup", function (event) {
    // console.log(this.value);
    if (event.key === "Enter") {
        fetchTasks(this.value);
    }
});

async function openViewModal(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const task = await response.json();

    document.querySelector(".view-task-title").value = task.title;
    document.querySelector(".view-task-description").value = task.description;
    document.querySelector(".view-task-deadline").value = task.deadline;

    document.querySelector(".view-todo-modal-container").style.display = 'block';
    document.querySelector(".modal-container").style.visibility = 'visible';
    document.querySelector(".modal-container").style.opacity = '1';
}

document.querySelector(".close-view-todo-btn").addEventListener("click", () => {
    document.querySelector(".view-todo-modal-container").style.display = 'none';
    document.querySelector(".modal-container").style.visibility = 'hidden';
    document.querySelector(".modal-container").style.opacity = '0';
});

async function toggleTask(id) {
    await fetch(`${API_URL}/${id}/marked`, { method: "PUT" });
    fetchTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
}

fetchTasks();
    
addBtn.addEventListener('click', () => {
    addTodoModalContainer.style.display = 'block';
    modalContainer.style.visibility = 'visible';
    modalContainer.style.opacity = '1';
});

cancelTodoBtn.addEventListener('click', () => {
    addTodoModalContainer.style.display = 'none';
    modalContainer.style.visibility = 'hidden';
    modalContainer.style.opacity = '0';
});

editTodoBtn.addEventListener('click', () => {
    editTodoModalContainer.style.display = 'block';
    modalContainer.style.visibility = 'visible';
    modalContainer.style.opacity = '1';
});

cancelEditBtn.addEventListener('click', () => {
    editTodoModalContainer.style.display = 'none';
    modalContainer.style.visibility = 'hidden';
    modalContainer.style.opacity = '0';
});