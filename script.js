const NOT_STARTED_STATUS = 'Not-Started';
const IN_PROGRESS_STATUS = 'In-progress';
const COMPLETED_STATUS = 'Completed';

// possible statuses in order (not-started -> in-progress -> completed)
const movement = [NOT_STARTED_STATUS, IN_PROGRESS_STATUS, COMPLETED_STATUS];

const tasksContainerElement = document.querySelector('.tasks-container');
const tasksCounterElement = document.getElementById('task-left-count');
const filterElement = document.querySelector('.filter');

// module storage
const LOCAL_STORAGE_KEY = 'tasks';

const tasksJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
let tasks;
if (tasksJSON == null) { // show 'lorem ipsum'
    tasks = [
        {title: 'Pick up groceries.', status: NOT_STARTED_STATUS},
        {title: 'Create TO-DO list.', status: COMPLETED_STATUS},
        {title: 'Make a video', status: IN_PROGRESS_STATUS},
        {title: 'Upload the video', status: IN_PROGRESS_STATUS}
    ];
} else {
    tasks = JSON.parse(tasksJSON);
}

/**
 * save tasks to local storage
 */
const save = () => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
// end module storage

// module renderer
/**
 * Add event handlers to element
 * @param element HTMLElement
 * @param task mixed {title: string, status: string}
 */
const addHandlers = (element, task) => {
    const statusButton = element.querySelector('.status-icon');
    const taskStatus = element.querySelector('.task-status');
    const deleteButton = element.querySelector('ion-icon');

    statusButton.onclick = () => {
        const status = movement.findIndex((cl) => element.classList.contains(cl));
        const nextStatus = movement[status + 1] ?? IN_PROGRESS_STATUS;
        element.classList.replace(movement[status], nextStatus);
        taskStatus.innerText = nextStatus;

        task.status = nextStatus;
        save();
    }

    deleteButton.onclick = () => {
        const container = document.querySelector('.tasks-container');

        container.removeChild(element);

        const index = tasks.findIndex((t) => t === task);
        tasks.splice(index, 1);
        tasksCounterElement.innerText = tasks.length.toString();

        save();
    }
}

/**
 * Shows selected filter based on filter id
 *
 * @param id string
 */
const showFilter = (id) => {
    for (const item of filterElement.children) {
        if (item.id === id) {
            item.classList.add('enabled');
        } else {
            item.classList.remove('enabled')
        }
    }
}

/**
 * Renders tasks to DOM
 *
 * @param task HTMLElement
 */
const renderTask = (task) => {
    const element = document.createElement('div');
    element.classList.add('task-card', task.status);

    element.innerHTML = `<div class="status-icon"></div>
                        <p class="task-text">${task.title}</p>
                        <p class="task-status">${task.status}</p>
                        <ion-icon class="delete fs-large mg-10" name="close-circle-outline" ></ion-icon>`

    addHandlers(element, task);

    tasksContainerElement.appendChild(element);
}

/**
 * Re-render all tasks to DOM
 *
 * @param tasks array of {title: string, status: string}
 */
const render = (tasks) => {
    tasksContainerElement.innerHTML = '';
    tasks.forEach((task) => renderTask(task));
    tasksCounterElement.innerText = tasks.length.toString(); // show count of displayed values
}
// end module renderer

/**
 * Adds new task and renders it
 * Check for title length
 *
 * @param title string
 */
const addTask = (title) => {
    if (title.trim().length === 0) {
        alert('Title cannot be empty');
        return;
    }

    const task = {title, status: NOT_STARTED_STATUS};

    tasks.push(task);
    tasksCounterElement.innerText = tasks.length.toString();
    save();

    render(tasks);
    showFilter('showAll');
}

// events
document.getElementById('completeAll').onclick = () => {
    tasks.forEach((task) => task.status = 'Completed');
    save();
    render(tasks);
}

document.getElementById('clearComplete').onclick = () => {
    tasks = tasks.filter((task) => task.status !== 'Completed');
    save();
    render(tasks);
}

document.getElementById('add-button').onclick = () => {
    const title = document.getElementById('new-task').value;

    addTask(title);
}

document.getElementById('showAll').onclick = () => {
    showFilter('showAll');
    render(tasks);
}

document.getElementById('showComplete').onclick = () => {
    showFilter('showComplete')
    render(tasks.filter((task) => task.status === COMPLETED_STATUS));
}

document.getElementById('showInprogress').onclick = () => {
    showFilter('showInprogress')
    render(tasks.filter((task) => task.status === IN_PROGRESS_STATUS));
}
document.getElementById('showNotStarted').onclick = () => {
    showFilter('showNotStarted')
    render(tasks.filter((task) => task.status === NOT_STARTED_STATUS));
}

render(tasks);
// end events