//global Variables
const projects = JSON.parse(localStorage.getItem('projects')) || [];
//const addProject = document.getElementById('btn-submit-project');
const createBtnProject = document.getElementById('btn-show-form');
const projectTitle = document.getElementById("project-title");
const formProject =  document.getElementById('container-form-project');
const projectsElement = document.getElementById("projects");
//const addTodoBtn = document.getElementById("btn-submit-todo");
const addTodoForm = document.getElementById('btn-add-todo');
const table = document.getElementById('todo-table');
const tableHeaders = table.getElementsByTagName('th');


//define Project object
class Project {
    constructor(name, todos) {
        this.name = name;
        this.todos = todos;
    }
}

// Define Todo object
class Todo {
    constructor(status=false, title, description, dueDate, priority) {
        this.status = status;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

//show project form
const showFormProject = (e) => {
	e.preventDefault();
	formProject.classList.add('active');
	formProject.style.visibility = 'visible';
    formProject.style.display = 'flex';
	const overlay = document.getElementById('overlay');
	overlay.style.display = 'block';
}

const closeFormProject = () => {
	const form =  document.getElementById('project-form');
	form.reset();
	formProject.classList.remove('active');
	formProject.style.visibility = 'hidden';
    formProject.style.display = 'none';
	const overlay = document.getElementById('overlay');
	overlay.style.display = 'none';
}

//create project
const createProject = () => {
	const name = document.getElementById('nameProject').value;
	projects.push(new Project(name, []));
	//Save project to localstorage
	localStorage.setItem('projects', JSON.stringify(projects));
	appendProject(name);
	closeFormProject();
	renderTodos();
}

//append project to menu
const appendProject = (name) => {
 	const projectElement = document.createElement('li');
	const listType = document.createElement('i');
	listType.classList.add('fa-solid', 'fa-circle-chevron-right');
	projectElement.appendChild(listType);
	const projectName = document.createElement('p');
	projectName.textContent = name;
	projectElement.appendChild(projectName);
 	projectElement.addEventListener("click", () => {
 			handleProject(name);
 			renderTodos();
 		});
	const deleteButton = document.createElement('button');
	deleteButton.classList = 'btn-icon';
	deleteButton.addEventListener("click", () => {
		const projectIndex = projects.findIndex((p) => p.name === name);
		projects.splice(projectIndex,1);
		localStorage.setItem('projects', JSON.stringify(projects));
		projectElement.remove();
		// let emptyString = '';
		// handleProject(emptyString);
	});
	projectElement.appendChild(deleteButton);
	const deleteIcon = document.createElement('i');
	deleteIcon.classList.add('fa-solid', 'fa-trash-can');
	deleteButton.appendChild(deleteIcon);
	projectsElement.appendChild(projectElement);

}


//render projects
function renderProjects() {
	//projectsElement.innerHTML = '';
	projects.forEach((project,index) => {
		appendProject(project.name);
	});

}

const setDefaultProject = () => {
	if (projects.length > 0){
		const defaultProject = projects[0].name;
		if (defaultProject !== ''){
			handleProject(defaultProject);
		} 
	}
}

//Render Name of project in main content
const handleProject = (name) => {
    const today = new Date();
    const endofWeek = new Date();
    endofWeek.setDate(endofWeek.getDate() + 7);

    //format date
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth()).padStart(2, '0');
        const year = date.getFullYear()

        return `${day}-${month}-${year}`;
    }

    if (name === "Today"){
        projectTitle.innerHTML = name + ' ' + formatDate(today);
    } else if(name === "This Week"){
        projectTitle.innerHTML = name + ' from ' + formatDate(today) + ' to ' + formatDate(endofWeek);
    } else {
	    projectTitle.innerHTML = name;
    }
}

//function to check if two days are the same day
function isSameDay(date1, date2){
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();

}

//function to check if a date is within the given week
function isWithinThisWeek(dateToCheck, startDate, endDate) {
    return dateToCheck >= startDate && dateToCheck <= endDate;
}

//render a single to-do item row
function renderTodoRow(todo, projectIndex, todoIndex) {
    const rowTodo = document.createElement('tr');

    //Create status
    const status = document.createElement('td');
    const statusCheck = document.createElement('input');
    statusCheck.type = "checkbox";
    statusCheck.value = todo.status;
    statusCheck.checked = todo.status;
    statusCheck.addEventListener("click", () => {
        const isChecked = statusCheck.checked;
        projects[projectIndex].todos[todoIndex].status = isChecked;
        localStorage.setItem('projects', JSON.stringify(projects));
    })
    status.appendChild(statusCheck);
    rowTodo.appendChild(status);
    //Create title
    const title = document.createElement('td');
    title.textContent = todo.title;
    rowTodo.appendChild(title);
    //Create description
    const description = document.createElement('td');
    description.textContent = todo.description;
    rowTodo.appendChild(description);
    //Create Due date
    const dueDate = document.createElement('td');
    dueDate.textContent = todo.dueDate;
    rowTodo.appendChild(dueDate);
    //Create Priority
    const priority = document.createElement('td');
    priority.textContent = todo.priority;
    rowTodo.appendChild(priority);
    //Create Actions
    const actions = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.classList = 'btn-icon';
    deleteButton.addEventListener("click", () => {
		projects[projectIndex].todos.splice(todoIndex,1);
        localStorage.setItem('projects', JSON.stringify(projects));
        renderTodos();
    })
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash-can');
    deleteButton.appendChild(deleteIcon);
    actions.appendChild(deleteButton);
    rowTodo.appendChild(actions);

    return rowTodo;
}

//Render list of Todos 
const renderTodos = (name) => {
	const currProject =  document.getElementById('project-title').innerHTML;
	const projectTable = document.getElementById('todo-table');
	clearList();

    if (name === "Today" || name ==="This Week"){
        const today = new Date();
        const endofWeek = new Date();
        endofWeek.setDate(endofWeek.getDate() + 7);
        addTodoForm.style.display = "none";
        //loop for all todos in each project
        for (let i = 0; i < projects.length; i++) {
            const todoList = projects[i].todos;

            for (let j = 0; j < todoList.length; j++){
                const dueDate = new Date(todoList[j].dueDate);
                dueDate.setMinutes(dueDate.getMinutes() + dueDate.getTimezoneOffset());
                //console.log(isWithinThisWeek(dueDate, today, endofWeek))
                if ((name === "Today" && isSameDay(today,dueDate)) ||
                    (name === "This Week" && isWithinThisWeek(dueDate, today, endofWeek))) {
                    projectTable.appendChild(renderTodoRow(todoList[j], i, j));
                }
            }

        }

    } else if (name === 'Home') {
        addTodoForm.style.display = "none";
        //loop for all todos in each project
        for (let i = 0; i < projects.length; i++){
                const todo = projects[i].todos;
                for (let j = 0; j < todo.length; j++){
                    projectTable.appendChild(renderTodoRow(todo[j], i, j));
                }
             
        }
        
    } else {
        addTodoForm.style.display = "block";
            //loop for all todos in each project
            for (let i = 0; i < projects.length; i++){
                if (projects[i].name === currProject){
                    const todo = projects[i].todos;
                    for (let j = 0; j < todo.length; j++){
                        projectTable.appendChild(renderTodoRow(todo[j], i, j));
                    }
                } 
            }
 
            
        }   
	
}

const clearList = () => {
	//get table
	const table = document.getElementById('todo-table');
	//get all rows except header row
	const rows = table.getElementsByTagName('tr');
	const numRows = rows.length;
	//loop through backwards to clear table except for td
	for (let i = numRows - 1; i > 0; i--){
		table.deleteRow(i);
	}
	
	
}

// Add todo to project
function addTodoToProject() {
	//event.preventDefault();
	//get index of project
	const projectIndex = projects.findIndex((p) => p.name === projectTitle.innerText);
	const project = projects[projectIndex];

	if (projectIndex >= 0){
 	//get data from todo form input
    const status = false;
	const title = document.getElementById('title').value;
	const description = document.getElementById('description').value;
	const dueDate = document.getElementById('dueDate').value;
	const priority = document.getElementById('priority').value;
	
 	const todo = new Todo(status,title, description, dueDate, priority);
 	project.todos.push(todo);
	localStorage.setItem('projects', JSON.stringify(projects));
	
	closeModalAddForm();
	renderTodos();
	}
}

//Sort table elements
function sortTable(columnIndex) {

    const rows = Array.from(table.getElementsByTagName('tr'));
    
    rows.sort( (a,b) => {
        const aCells = a.getElementsByTagName("td");
        const bCells = b.getElementsByTagName("td");
        
        if (aCells.length <= columnIndex || bCells.length <= columnIndex){
            return 0;
        }
        
        const aValue = aCells[columnIndex].innerText.toLowerCase();
        const bValue = bCells[columnIndex].innerText.toLowerCase();

        if (aValue < bValue){
            return -1;
        }
        if (aValue > bValue){
            return 1;
        }
        return 0;
    });

    rows.forEach( row => table.appendChild(row));

}

//Listener to Sort Table by column
for (let columnIndex = 0; columnIndex < tableHeaders.length; columnIndex++){
    tableHeaders[columnIndex].addEventListener("click", () => {
        sortTable(columnIndex);
    });
}

const openModalAddForm = () => {
	const todoForm = document.getElementById('add-todo');
	const overlay = document.getElementById('overlay');
	todoForm.classList.add('active');
	overlay.style.display = 'block';
	
}

const closeModalAddForm = () => {
	const todoForm = document.getElementById('add-todo');
	if (formProject.style.visibility === 'visible'){
		closeFormProject();
	} else {
		const todoForm = document.getElementById('add-todo');
		const form = document.getElementById('todo-form');
		const overlay = document.getElementById('overlay');
		todoForm.classList.remove('active');
		overlay.style.display = 'none';
		form.reset();
	}
}


//call functions to initialize the app
function init(){
	setDefaultProject();
	renderProjects();
	renderTodos(); 
}
//call function init when page loads
window.addEventListener("load",init);

//Listeners
//addProject.onclick = createProject;
createBtnProject.onclick = showFormProject;
//addTodoBtn.onclick = addTodoToProject;
addTodoForm.onclick = openModalAddForm;
document.getElementById('overlay').onclick = closeModalAddForm;
document.getElementById('btn-close-project').onclick = closeFormProject;

const firstUl = document.querySelector('ul:first-of-type');
const liElements = firstUl.querySelectorAll('li');
liElements.forEach( li => {
    li.addEventListener("click", () =>{
        const spanContent = li.querySelector('span').textContent;
        handleProject(spanContent);
        renderTodos(spanContent);
    })
});

