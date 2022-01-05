const inputTask = document.getElementById("inputTask");
const btnAdd = document.getElementById("btnAdd");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

let draggedElement;

let tasks = JSON.parse(localStorage.getItem("tasks"));

if (tasks) {
    tasks.pending.forEach(function (task) {
        createTask(task, false);
    });
    tasks.completed.forEach(function (task) {
        createTask(task, true);
    });
} else {
    tasks = { pending: [], completed: [] };
}

function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTasksStatus(currentBranch, task) {
    const otherBranch = currentBranch === "completed" ? "pending" : "completed";
    removeTaskItem(currentBranch, task);
    tasks[otherBranch].push(task);
    updateLocalStorage();
}

function updateTaskOrder(branch, movedTask, taskBefore) {
    const movedIndex = tasks[branch].indexOf(movedTask);
    tasks[branch].splice(movedIndex, 1);
    let toIndex = tasks[branch].indexOf(taskBefore);
    if (toIndex === -1) {
        toIndex = tasks[branch].length;
    }
    tasks[branch].splice(toIndex, 0, movedTask);
    updateLocalStorage();
}

function removeTaskItem(branch, task) {
    // const tempTasks;
    const index = tasks[branch].indexOf(task);
    tasks[branch].splice(index, 1);
}

function isTaskInList(task) {
    return tasks.pending.includes(task) || tasks.completed.includes(task);
}

function getCurrentTaskBranch(element) {
    return element.classList.contains("completed") ? "completed" : "pending";
}

function getTaskFromLi(element) {
    /* task.children [
        0 - checkbox
        1 - p (Task Name)
        2 - button
        ]
    */

    // if placeholder element for drag and drop functionality passed, element.children[1].innerHTML throws error
    return element.children.length > 0 ? element.children[1].innerHTML : "";
}

function createDraggableLi() {
    function dragOver(event) {
        if (
            draggedElement.parentElement === this.parentElement &&
            draggedElement !== this
        ) {
            event.preventDefault();
            this.classList.add("drag-over");
        }
    }

    function dragLeave() {
        this.classList.remove("drag-over");
    }

    function drop() {
        const currentBranch = getCurrentTaskBranch(this.parentElement);

        // task.children [
        // 0 - checkbox
        // 1 - p (Task Name)
        // 2 - button
        // ]
        const taskToMove = getTaskFromLi(draggedElement);
        const taskBefore = getTaskFromLi(this);
        updateTaskOrder(currentBranch, taskToMove, taskBefore);

        this.classList.remove("drag-over");
        this.parentElement.insertBefore(draggedElement, this);
    }

    const liTask = document.createElement("li");
    liTask.classList.add("task");

    liTask.addEventListener("dragstart", function (event) {
        draggedElement = this;
        const placeholder = document.createElement("li");
        placeholder.classList.add("task");
        placeholder.id = "placeholder";
        placeholder.addEventListener("dragover", dragOver);
        placeholder.addEventListener("dragleave", dragLeave);
        placeholder.addEventListener("drop", drop);

        this.parentElement.appendChild(placeholder);
        event.dataTransfer.setData("text/plain", "task");
        event.dataTransfer.effectAllowed = "move";
        setTimeout(() => this.classList.add("hide"), 0);
    });

    liTask.addEventListener("dragend", function () {
        draggedElement = null;
        const parentChildren = this.parentElement.children;
        this.parentElement.removeChild(
            parentChildren[parentChildren.length - 1]
        );
        this.classList.remove("hide");
    });

    liTask.addEventListener("dragover", dragOver);
    liTask.addEventListener("dragleave", dragLeave);
    liTask.addEventListener("drop", drop);

    return liTask;
}

// Function created so can recreate todo list from localstorage
function createTask(task, completed) {
    inputTask.value = "";

    elementToAppendTask = completed ? completedTasks : pendingTasks;

    // Separate function to handle drag and drop functions cleaner
    const liTask = createDraggableLi();
    liTask.setAttribute("draggable", !completed);

    const checkDivTask = document.createElement("div");
    checkDivTask.classList.add("check-container");

    if (completed) {
        liTask.classList.add("completed");
        checkDivTask.classList.add("active");
    }

    checkDivTask.addEventListener("click", function () {
        const elementToMoveTask =
            liTask.parentElement === pendingTasks
                ? completedTasks
                : pendingTasks;

        elementToMoveTask.appendChild(liTask);

        // change state of custom checkbox
        this.classList.toggle("active");

        liTask.toggleAttribute("draggable");

        const currentBranch = getCurrentTaskBranch(this.parentElement);
        updateTasksStatus(currentBranch, task);
        liTask.classList.toggle("completed");
    });

    const pTask = document.createElement("p");
    pTask.innerHTML = task;

    const btnRemove = document.createElement("button");
    btnRemove.innerHTML = "Remove";

    btnRemove.addEventListener("click", function () {
        const currentBranch = getCurrentTaskBranch(this.parentElement);
        removeTaskItem(currentBranch, task);
        updateLocalStorage();
        liTask.parentElement.removeChild(this.parentElement);
    });

    liTask.appendChild(checkDivTask);
    liTask.appendChild(pTask);
    liTask.appendChild(btnRemove);
    elementToAppendTask.appendChild(liTask);
}

btnAdd.addEventListener("click", function () {
    const newTask = inputTask.value;

    if (newTask && !isTaskInList(newTask)) {
        // Function created so can recreate todo list from localstorage
        createTask(newTask, false);
        tasks.pending.push(newTask);
        updateLocalStorage();
    } else if (isTaskInList(newTask)) {
        alert("Task already added!");
        inputTask.value = "";
    } else {
        alert("Please enter a task!");
    }
});
