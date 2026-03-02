const title = document.getElementById('title');
const priority = document.getElementById('priority');
const dueDate = document.getElementById('due-date');
const description = document.getElementById('description');
const form = document.getElementById('form');
let dragged = document.createElement('div');

//  ---------------Dark / Light mode toggle ---------------------------- //
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const savedTheme = localStorage.getItem('theme');
if(savedTheme === 'light'){
    document.body.classList.add('light-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}
themeToggle.addEventListener('click', function(){
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeIcon.classList.replace(isLight ? 'fa-moon' : 'fa-sun', isLight ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});


const TASKS_VERSION = 1;
const storedTasks = JSON.parse(localStorage.getItem('allTasks'));
const storedVersion = parseInt(localStorage.getItem('tasksVersion')) || 0;
const allTask = (storedTasks && storedTasks.length > 0 && storedVersion >= TASKS_VERSION) ? storedTasks : defaultTasks;
localStorage.setItem('allTasks', JSON.stringify(allTask));
localStorage.setItem('tasksVersion', TASKS_VERSION);
console.log(allTask);
// console.log(title);
// allTask = allTask.push(anotherTasks);
const todo = JSON.parse(localStorage.getItem('todo')) || [];
// const inProgress = JSON.parse(localStorage.getItem('inProgress')) || [];
const completed = JSON.parse(localStorage.getItem('completed')) || [];
// const overdue = JSON.parse(localStorage.getItem('overdue')) || [];




// --------------------------add task form submission --------------------------- //
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    // check for console is form submitted or not
    console.log('form submitted.');
    console.log("Title : " + title.value + 
        "\nPriority : " + priority.value + 
        "\nDue Date : " + dueDate.value + 
        "\nDescription :" + description.value);
    
    const task = {
        id : allTask.length + 1,
        title : title.value,
        priority : priority.value,
        dueDate : dueDate.value,
        description : description.value,
        status : 'todo'
    }
    allTask.push(task);
    console.log(allTask);
    // Re-sort after adding new task
    // const priorityOrder = { high: 1, medium: 2, low: 3 };
    // allTask.sort((a, b) => {
    //     const pA = priorityOrder[a.priority] || 4;
    //     const pB = priorityOrder[b.priority] || 4;
    //     if (pA !== pB) return pA - pB;
    //     return new Date(a.dueDate) - new Date(b.dueDate);
    // });
    localStorage.setItem('allTasks',JSON.stringify(allTask));


    // Re-render all tasks in sorted order
    // toDoTaskContainer.querySelectorAll('.task-shown').forEach(el => el.remove());
    // progressTaskContainer.querySelectorAll('.task-shown').forEach(el => el.remove());
    // completedTaskContainer.querySelectorAll('.task-shown').forEach(el => el.remove());
    // overdueTaskContainer.querySelectorAll('.task-shown').forEach(el => el.remove());
    allTask.forEach(t => tasksShown(t));
    updateTaskCounts();

    // after submitted form set value to empty so can add new task easily.
    title.value = "";
    priority.value = "low";
    dueDate.value = "";
    description.value = "";
})

// ---------------------------- add task option - by default its hidden ------------------------------
let btnAddTaskVisible = false;
const addTask = document.getElementById('btn-add-task');
const addTaskArrow = addTask.querySelector('.add-task-arrow');
addTask.addEventListener('click' , () => {
    if(btnAddTaskVisible === true){
        form.classList.add('hide-task-form');
        addTask.style.borderRadius = '10px';
        addTaskArrow.classList.remove('rotate-up');
        btnAddTaskVisible = false;
    }else{
        form.classList.remove('hide-task-form');
        addTask.style.borderRadius = '10px 10px 0 0';
        addTaskArrow.classList.add('rotate-up');
        btnAddTaskVisible = true;
    }
})


const toDoTaskContainer = document.getElementById('task-container-to-do');
const progressTaskContainer = document.getElementById('task-container-in-progress');
const completedTaskContainer = document.getElementById('task-container-completed');
const overdueTaskContainer = document.getElementById('task-container-overdue');


// ------------------------- tasks shown function ----------------------------------  //
function tasksShown(task){
    // console.log('called')
    if(task.status === 'todo'){
            let tasks = `
        <div draggable="true" class="task-shown ${task.priority} ${task.status}">
            <div class="taskName">
                <h2>${task.title}</h2>
                <h3>${task.priority}</h3>
                <h4 id="task-id" class="hidden-important">${task.id}</h4>
                <button><img src="./arrow-down-3101.svg" alt="arrow-down" class="arrow-down"></button>    
            </div>
            <div class="dueDate">Due Date : ${task.dueDate}</div>
            <div class="description hidden">${task.description}</div>
            <div class="btn">
                
                <button class="btn-progress" title="click to move task in progress"><i class="fa-solid fa-spinner"></i></button>
                <button class="btn-completed" title="complete task"><i class="fa-solid fa-check"></i></button>
                <button class="btn-edit" title="edit task"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-delete" title="delete task"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
        `
            toDoTaskContainer.innerHTML += tasks;
        }
        else if (task.status === 'progress'){
            let tasks = `
        <div draggable="true" class="task-shown ${task.priority} ${task.status}">
            <div class="taskName">
                <h2>${task.title}</h2>
                <h3>${task.priority}</h3>
                <h4 id="task-id" class="hidden-important">${task.id}</h4>
                <button><img src="./arrow-down-3101.svg" alt="arrow-down" class="arrow-down"></button>    
            </div>
            <div class="dueDate">Due Date : ${task.dueDate}</div>
            <div class="description hidden">${task.description}</div>
            <div class="btn">
                
                <button class="btn-progress hidden" title="click to move task in progress"><i class="fa-solid fa-spinner"></i></button>
                <button class="btn-completed" title="complete task"><i class="fa-solid fa-check"></i></button>
                <button class="btn-edit" title="edit task"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-delete" title="delete task"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
        `
            progressTaskContainer.innerHTML += tasks;
        }
        else if(task.status === 'completed'){
            let tasks = `
        <div class="task-shown task-shown-completed ${task.status}">
            <div class="taskName">
                <h2>${task.title}</h2>
                <h3>${task.priority}</h3>
                <h4 id="task-id" class="hidden-important">${task.id}</h4>
                <button><img src="./arrow-down-3101.svg" alt="arrow-down" class="arrow-down"></button>    
            </div>
<!--            <div class="dueDate hidden">Due Date : 28-02-2026</div>-->
            <div class="description hidden">${task.description}</div>
        </div>`
            completedTaskContainer.innerHTML += tasks;
        }
        else if(task.status === 'overdue'){
            let tasks = `
        <div draggable="true" class="task-shown overdue ${task.priority}">
            <div class="taskName">
                <h2>${task.title}</h2>
                <h3>${task.priority}</h3>
                <h4 id="task-id" class="hidden-important">${task.id}</h4>
                <button><img src="./arrow-down-3101.svg" alt="arrow-down" class="arrow-down"></button>    
            </div>
            <div class="dueDate" style="color: #ff6b6b;">Due Date : ${task.dueDate} (Overdue)</div>
            <div class="description hidden">${task.description}</div>
            <div class="btn">
                <button class="btn-completed" title="complete task"><i class="fa-solid fa-check"></i></button>
                <button class="btn-edit" title="edit task"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-delete" title="delete task"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`
            overdueTaskContainer.innerHTML += tasks;
        }
}

// -------------------------- Check for overdue tasks -------------------------------- //
function checkOverdueTasks(){
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let changed = false;
    allTask.forEach(task => {
        if(task.status !== 'completed' && task.status !== 'overdue' && task.dueDate){
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            if(dueDate < today){
                task.status = 'overdue';
                changed = true;
            }
        }
    });
    if(changed){
        localStorage.setItem('allTasks', JSON.stringify(allTask));
    }
}

checkOverdueTasks();

// Smart Sort: sort by priority (high > medium > low), then by nearest due date 
const priorityOrder = { high: 1, medium: 2, low: 3 };
allTask.sort((a, b) => {
    const pA = priorityOrder[a.priority] || 4;
    const pB = priorityOrder[b.priority] || 4;
    if (pA !== pB) return pA - pB;
    return new Date(a.dueDate) - new Date(b.dueDate);
});

// Re-check every 1 hours in case a task becomes overdue while page is open
setInterval(function(){
    const prevStatuses = allTask.map(t => t.status);
    checkOverdueTasks();
    const changed = allTask.some((t, i) => t.status !== prevStatuses[i]);
    if(changed) window.location.reload();
}, 60000*60*1);

allTask.forEach(task => {
    tasksShown(task);
})
tasksShown(allTask);

// ------------------------------ tasks count total ----------------------------- // 
updateTaskCounts();

function updateTaskCounts(){
    document.getElementById('count-todo').textContent = allTask.filter(t => t.status === 'todo').length;
    document.getElementById('count-progress').textContent = allTask.filter(t => t.status === 'progress').length;
    document.getElementById('count-completed').textContent = allTask.filter(t => t.status === 'completed').length;
    document.getElementById('count-overdue').textContent = allTask.filter(t => t.status === 'overdue').length;
}
// ------------------------------showDescription - shows description when click on arrow down button ----- //
function showDescription(taskColumn){
    taskColumn.addEventListener('click',function(e){
        const toggleBtn = e.target.closest('.taskName button');
        if(!toggleBtn) return;

        const taskDiv = toggleBtn.closest('.task-shown');
        const desc = taskDiv.querySelector('.description');
        desc.classList.toggle('hidden');
        toggleBtn.classList.toggle('rotate');
    })
} 

showDescription(toDoTaskContainer);
showDescription(progressTaskContainer);
showDescription(completedTaskContainer);
showDescription(overdueTaskContainer);



// --------------------------- shown drop here button where I can drop tasks ---------------------- // 
let hideDropHereColumn = null;
function showDrop(taskColumn){
    // console.log('show drop call')
    // console.log(taskColumn);
    let taskColumnId = document.getElementById(taskColumn.id);
    let dropHere = taskColumnId.querySelector('.drop-here');
    // console.log(dropHere);
    dropHere.classList.toggle('hidden-important');
}
function hideDrop(taskColumn){
    let taskColumnId = document.getElementById(taskColumn.id);
    let dropHere = taskColumnId.querySelector('.drop-here');
    // console.log(dropHere);
    dropHere.classList.toggle('hidden-important');

}
function showDropHere(taskColumnId){
    hideDropHereColumn = taskColumnId;
    const allContainers = [toDoTaskContainer, progressTaskContainer, completedTaskContainer, overdueTaskContainer];
    allContainers.forEach(container => {
        if(container.id !== taskColumnId){
            showDrop(container);
        }
    });
}
function hideDropHere(){
    const allContainers = [toDoTaskContainer, progressTaskContainer, completedTaskContainer, overdueTaskContainer];
    allContainers.forEach(container => {
        if(container.id !== hideDropHereColumn){
            hideDrop(container);
        }
    });
}
// drag and drop 

// Helper: find which task element the dragged item should be placed before
function getDragAfterElement(container, y) {
    const dropzone = container.querySelector('.dropzone') || container;
    const draggableElements = [...dropzone.querySelectorAll('.task-shown:not(.dragging)')];
    
    let closest = { offset: Number.POSITIVE_INFINITY, element: null };
    
    draggableElements.forEach(child => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > -closest.offset) {
            closest = { offset: -offset, element: child };
        }
    });
    
    return closest.element;
}

// Helper: persist reorder to localStorage by reading DOM order
function updateTaskOrder(container) {
    const taskElements = container.querySelectorAll('.task-shown');
    const orderedIds = [...taskElements].map(el => {
        const idEl = el.querySelector('#task-id');
        return idEl ? parseInt(idEl.innerHTML) : null;
    }).filter(id => id !== null);
    
    // Reorder allTask array to match DOM order within this column,
    // while keeping tasks from other columns in their original positions
    const reorderedTasks = orderedIds.map(id => allTask.find(t => t.id === id)).filter(Boolean);
    const otherTasks = allTask.filter(t => !orderedIds.includes(t.id));
    
    // Rebuild: keep the overall array but update positions
    allTask.length = 0;
    // Insert reordered tasks at their original position group
    let inserted = false;
    const statusOfReordered = reorderedTasks[0]?.status;
    otherTasks.forEach(t => {
        if (!inserted && statusOfReordered && shouldInsertBefore(t.status, statusOfReordered)) {
            reorderedTasks.forEach(rt => allTask.push(rt));
            inserted = true;
        }
        allTask.push(t);
    });
    if (!inserted) {
        reorderedTasks.forEach(rt => allTask.push(rt));
    }
    
    localStorage.setItem('allTasks', JSON.stringify(allTask));
}

function shouldInsertBefore(currentStatus, reorderedStatus) {
    const order = ['todo', 'progress', 'completed', 'overdue'];
    return order.indexOf(currentStatus) > order.indexOf(reorderedStatus);
}

function dragAndDrop(taskColumn){
    taskColumn.addEventListener('dragstart', function(e) {
        dragged = e.target;
        e.target.classList.add('dragging');
        showDropHere(taskColumn.id);
    });

    taskColumn.addEventListener('dragend',function(e){
        // console.log('dragend')
        e.target.classList.remove('dragging');
        document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
        hideDropHere();
    })

    taskColumn.addEventListener('dragenter',function(e){
        if(e.target.classList.contains('.drop-here')){
            e.target.classList.add('dragover');
        }
        const dropZone = e.target.closest('.dropzone');
        if (dropZone) {
            dropZone.classList.add('dragover');
        }
    })

    taskColumn.addEventListener('dragleave',function(e){
        if(e.target.classList.contains('.drop-here')){
            e.target.classList.remove('dragover');
        }
        const dropZone = e.target.closest('.dropzone');
        if (dropZone) {
            dropZone.classList.remove('dragover');
        }
    })

    taskColumn.addEventListener('dragover',function(e){
        e.preventDefault();
        // Reorder: show drop indicator between tasks
        const afterElement = getDragAfterElement(taskColumn, e.clientY);
        const draggingEl = document.querySelector('.dragging');
        if (!draggingEl) return;
        
        // Remove any existing drop indicators
        document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
        
        // Only show indicator if hovering over the same or different column
        const indicator = document.createElement('div');
        indicator.classList.add('drop-indicator');
        
        if (afterElement == null) {
            taskColumn.appendChild(indicator);
        } else {
            taskColumn.insertBefore(indicator, afterElement);
        }
    })

    taskColumn.addEventListener('drop',function(e){

        e.preventDefault();
        // Remove all drop indicators
        document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
        
        const dropZone = e.target.closest('.dropzone');
        if (!dropZone && !taskColumn.contains(e.target)) return;
        
        const targetId = taskColumn.querySelector('.dropzone')?.id || taskColumn.id;
        const afterElement = getDragAfterElement(taskColumn, e.clientY);
        
        // Update status if moving to a different column
        if (dragged.parentElement !== taskColumn && dropZone) {
            changeTaskStatusInUI(dragged, dropZone.id);
            dropZone.classList.remove('dragover');
        }
        
        // Insert at the correct position (reorder)
        const container = taskColumn.querySelector('.dropzone') || taskColumn;
        if (afterElement == null) {
            container.appendChild(dragged);
        } else {
            container.insertBefore(dragged, afterElement);
        }
        
        // Update task order in localStorage
        updateTaskOrder(container);
        updateTaskCounts();
    })
}


dragAndDrop(toDoTaskContainer);
dragAndDrop(progressTaskContainer);
dragAndDrop(completedTaskContainer);
dragAndDrop(overdueTaskContainer);

// --------------------------- change task status in ui when drag and drop or click using button --------- //
function changeTaskStatusInUI(dragged,targetId){
    if(targetId === dragged.id) return;
    // Remove all status classes
    dragged.classList.remove('todo','progress','completed','overdue','task-shown-completed');
    
    if(targetId === 'task-container-completed'){
        dragged.draggable = false;
        dragged.classList.add('completed');
        dragged.classList.add('task-shown-completed');
        dragged.querySelector('.dueDate').classList.add('hidden');
        dragged.querySelector('.btn').classList.add('hidden-important');
        changeTaskStatus(dragged,'completed');
    }else if(targetId === 'task-container-in-progress'){
        dragged.draggable = true;
        dragged.classList.add('progress');
        dragged.querySelector('.dueDate').classList.remove('hidden');
        dragged.querySelector('.dueDate').style.color = '';
        dragged.querySelector('.btn').classList.remove('hidden-important');
        const progressBtn = dragged.querySelector('.btn-progress');
        if(progressBtn) progressBtn.classList.add('hidden');
        changeTaskStatus(dragged,'progress');
    }else if(targetId === 'task-container-to-do'){
        dragged.draggable = true;
        dragged.classList.add('todo');
        dragged.querySelector('.dueDate').classList.remove('hidden');
        dragged.querySelector('.dueDate').style.color = '';
        dragged.querySelector('.btn').classList.remove('hidden-important');
        const progressBtn = dragged.querySelector('.btn-progress');
        if(progressBtn) progressBtn.classList.remove('hidden');
        changeTaskStatus(dragged,'todo');
    }else if(targetId === 'task-container-overdue'){
        dragged.draggable = true;
        dragged.classList.add('overdue');
        dragged.querySelector('.dueDate').classList.remove('hidden');
        dragged.querySelector('.dueDate').style.color = '#ff6b6b';
        dragged.querySelector('.btn').classList.remove('hidden-important');
        const progressBtn = dragged.querySelector('.btn-progress');
        if(progressBtn) progressBtn.classList.add('hidden');
        changeTaskStatus(dragged,'overdue');
    }
}

function changeTaskStatus(dragged,updatedStatus){
    let taskId = dragged.querySelector('#task-id').innerHTML;
    taskId = parseInt(taskId);
    const getTask = allTask.find(task => task.id === taskId);
    getTask.status = updatedStatus;
    // tasksShown(getTask);
    localStorage.setItem('allTasks',JSON.stringify(allTask));
}

function changeToProgress(taskColumn){
    taskColumn.addEventListener('click',function(e){
        const btnProgress = e.target.closest('.btn-progress');
        if(!btnProgress) return;
        // console.log(btnProgress);

        const task = btnProgress.closest('.task-shown');
        // console.log(task);
        changeTaskStatus(task,"progress");
        refreshPage();
    })
}
changeToProgress(toDoTaskContainer);

function changeToCompleted(taskColumn){
    taskColumn.addEventListener('click',function(e){
        // console.log(e.target)
        const btnProgress = e.target.closest('.btn-completed');
        // console.log(btnProgress);
        if(!btnProgress) return;


        const task = btnProgress.closest('.task-shown');
        console.log(task);
        changeTaskStatus(task,"completed");
        refreshPage();
    })
}

changeToCompleted(toDoTaskContainer);
changeToCompleted(progressTaskContainer);
changeToCompleted(overdueTaskContainer);


// ----------------------------------edit the task ----------------------------------- //
function editTask(task){
    task.addEventListener('click',function(e){
        const btnEdit = e.target.closest('.btn-edit');
        if(!btnEdit) return;
        // console.log(btnEdit);
        const taskDiv = btnEdit.closest('.task-shown');
        // console.log(taskDiv);    
        editTaskModal(taskDiv);
    })
}
editTask(toDoTaskContainer);
editTask(progressTaskContainer);
editTask(overdueTaskContainer);
// editTask(completedTaskContainer);


function editTaskModal(taskDiv){
    console.log(taskDiv);
    const id = parseInt(taskDiv.querySelector('#task-id').innerHTML);
    const getTask = allTask.find(task => task.id === id);
    console.log(getTask);
    const overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');
    overlay.innerHTML =`
        <div class="modal edit-modal">
            <h3 class="edit-modal-title"><i class="fa-solid fa-pen-to-square"></i> Edit Task</h3>
            <form id='edit-task-modal'>
                <label>Title</label>
                <input type="text" id="title-edit" value="${getTask.title}">
                <div class="edit-form-row">
                    <div>
                        <label>Priority</label>
                        <select id="priority-edit">
                            <option value="low" ${getTask.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${getTask.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${getTask.priority === 'high' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    <div>
                        <label>Due Date</label>
                        <input type="date" id="due-date-edit" value="${getTask.dueDate}" required>
                    </div>
                </div>
                <label>Description</label>
                <textarea id="description-edit" rows="3">${getTask.description}</textarea>
                <div class="modal-btn-group">
                    <button type="submit" id="btn-edit-task" class="btn-save">Save</button>
                    <button type="button" id="btn-cancel-edit" class="btn-cancel">Cancel</button>
                </div>
            </form>
        </div>`
    document.body.appendChild(overlay);

    // Close modal on Cancel button click
    document.getElementById('btn-cancel-edit').addEventListener('click', function(){
        overlay.remove();
    });

    // Close modal when clicking outside the modal (on the overlay background)
    overlay.addEventListener('click', function(e){
        if(e.target === overlay){
            overlay.remove();
        }
    });

    const editForm = document.getElementById('edit-task-modal');
    editForm.addEventListener('submit',function(e){
        e.preventDefault();
        const titleVal = document.getElementById('title-edit').value;
        const priorityVal = document.getElementById('priority-edit').value;
        const dueDateVal = document.getElementById('due-date-edit').value;
        const descriptionVal = document.getElementById('description-edit').value;
        console.log(titleVal);
        console.log(priorityVal);
        console.log(dueDateVal);
        console.log(descriptionVal);

        // Update the task object in-place (it's a reference in allTask array)
        getTask.title = titleVal;
        getTask.priority = priorityVal;
        getTask.dueDate = dueDateVal;
        getTask.description = descriptionVal;
        localStorage.setItem('allTasks',JSON.stringify(allTask));

        // Update the task card in the DOM without refreshing
        taskDiv.querySelector('.taskName h2').textContent = titleVal;
        taskDiv.querySelector('.taskName h3').textContent = priorityVal;
        taskDiv.querySelector('.dueDate').textContent = 'Due Date : ' + dueDateVal;
        taskDiv.querySelector('.description').textContent = descriptionVal;

        // Update priority class on the card
        taskDiv.classList.remove('low', 'medium', 'high');
        taskDiv.classList.add(priorityVal);

        overlay.remove();
        updateTaskCounts();
    })

}


// -------------------------------------delete task  -------------------------------------//
function deleteTask(taskColumn){
    taskColumn.addEventListener('click', function(e){
        const btnDelete = e.target.closest('.btn-delete');
        if(!btnDelete) return;
        const taskDiv = btnDelete.closest('.task-shown');
        const taskId = parseInt(taskDiv.querySelector('#task-id').innerHTML);
        const taskTitle = taskDiv.querySelector('.taskName h2').textContent;

        const theme = localStorage.getItem('theme');
        // const deleteModalTextColor = '';
        if(theme === 'dark'){
            modalTheme = 'deleteModalLight';
        }else{
            modalTheme = 'deleteModalDark';
        }
        // Create delete confirmation modal
        const overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');
        overlay.innerHTML = `
            <div class="modal delete-modal ${modalTheme}">
                <div class="delete-modal-icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3>Delete Task</h3>
                <p>Are you sure you want to delete <strong>"${taskTitle}"</strong>?</p>
                <p class="delete-modal-warning">This action cannot be undone.</p>
                <div class="modal-btn-group">
                    <button id="btn-confirm-delete" class="btn-submit btn-danger">Delete</button>
                    <button id="btn-cancel-delete" class="btn-submit btn-cancel">Cancel</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        document.getElementById('btn-confirm-delete').addEventListener('click', function(){
            const index = allTask.findIndex(task => task.id === taskId);
            if(index !== -1){
                allTask.splice(index, 1);
                localStorage.setItem('allTasks', JSON.stringify(allTask));
            }
            taskDiv.remove();
            updateTaskCounts();
            overlay.remove();
        });

        document.getElementById('btn-cancel-delete').addEventListener('click', function(){
            overlay.remove();
        });

        overlay.addEventListener('click', function(ev){
            if(ev.target === overlay) overlay.remove();
        });
    })
}
deleteTask(toDoTaskContainer);
deleteTask(progressTaskContainer);
deleteTask(completedTaskContainer);
deleteTask(overdueTaskContainer);


function refreshPage(){
    window.location.reload();   
}



// ------------------------------------ search and filter --------------------------------- //

function displaySearchTasks(tasks){
    let container = document.getElementById(('search-filter-container'));
    let task = `
    <div class="search-filter-task-container ${tasks.status}">
    <h2>${tasks.title}</h2>
    <p>${tasks.description}</p>
    </div> 
    `
    container.innerHTML += task;
}

// Toggle search & filter visibility
const btnToggleSearch = document.getElementById('btn-toggle-search');
const searchFilterPanel = document.querySelector('.search-filter');
const toggleArrow = btnToggleSearch.querySelector('.toggle-arrow');
btnToggleSearch.addEventListener('click', function(){
    searchFilterPanel.classList.toggle('hide-search-filter');
    toggleArrow.classList.toggle('rotate-up');
    if(searchFilterPanel.classList.contains('hide-search-filter')){
        btnToggleSearch.style.borderRadius = '10px';
    } else {
        btnToggleSearch.style.borderRadius = '10px 10px 0 0';
    }
});

const btnSearch = document.querySelector('#search-task');
const searchInput = document.querySelector('#search');

function performSearch(){
    const query = searchInput.value.trim().toLowerCase();
    const searchFilterTaskContainer = document.getElementById('search-filter-container');
    if(query === ''){
        searchFilterTaskContainer.innerHTML = `<div class="empty-search-filter">Nothing to show. Apply filter or search by task title.</div>`;
        return;
    }
    const tasks = allTask.filter(task => task.title.toLowerCase().includes(query));
    if(tasks.length === 0) {
        searchFilterTaskContainer.innerHTML = `
        <div class="no-task">
        No Tasks Found. 
        </div>
        `;
    }else{
        searchFilterTaskContainer.innerHTML = ``
    }
    tasks.forEach(task => {
        displaySearchTasks(task);
    })
}

searchInput.addEventListener('input', performSearch);
// Also search on button click
btnSearch.addEventListener('click', performSearch);

const filterTaskPriority = document.querySelector('#task-priority');
const filterTaskStatus = document.querySelector('#task-status');

filterTaskPriority.addEventListener('change', function(e){
    console.log(filterTaskPriority.value);
    const filterTasks = allTask.filter(task =>{
        if(task.priority === filterTaskPriority.value){
            return task;
        }
    })
    console.log(filterTasks);
    const searchFilterTaskContainer = document.querySelector('#search-filter-container');
    if(filterTasks.length === 0){
        console.log('No tasks found.');
        searchFilterTaskContainer.innerHTML = `
        <div class="no-task">
        No Tasks Found. 
        </div>
        `;
    }else{
        searchFilterTaskContainer.innerHTML = ``
    }
    filterTasks.forEach(task => {
        displaySearchTasks(task);
    })
    // Reset only status dropdown to default, keep priority selected
    filterTaskStatus.selectedIndex = 0;
})

filterTaskStatus.addEventListener('change', function(e){
    console.log(filterTaskStatus.value);
    const filterTasks = allTask.filter(task =>{
        if((task.status === 'progress' || task.status === 'todo') && (filterTaskStatus.value === 'pending')){
            return task;
        }else if(task.status === filterTaskStatus.value){
            return task;
        }else if(task.status === filterTaskStatus.value) {
            return task;
        }
    })
    const searchFilterTaskContainer = document.querySelector('#search-filter-container');
    if(filterTasks.length === 0){
        console.log('No tasks found.');
        searchFilterTaskContainer.innerHTML = `
        <div class="no-task">
        No Tasks Found. 
        </div>
        `;
    }else{
        searchFilterTaskContainer.innerHTML = ``
    }
    console.log(filterTasks);
    filterTasks.forEach(task => {
        displaySearchTasks(task);
    })
    // Reset only priority dropdown to default, keep status selected
    filterTaskPriority.selectedIndex = 0;
})