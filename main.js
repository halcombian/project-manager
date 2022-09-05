const themeBtn = document.getElementById("theme-btn");
themeBtn.addEventListener("click", () => {
	document.body.classList.toggle("dark-theme");

	//Changes theme-button's marterial icon
	if (document.body.classList.contains("dark-theme")) {
		themeBtn.textContent = "light_mode";
	} else {
		themeBtn.textContent = "dark_mode";
	}
});

const projectCon = document.getElementById("project-con");

const startProjectBtn = document.getElementById("start-project");
startProjectBtn.addEventListener("click", () => {
	startProjectBtn.style.display = "none"; //classList.toggle("display-none") doesn't work here

	createProjectWindow();
	addBtnListener();
	closeBtnListener();
});

const taskCon = document.getElementById("task-con");

const startTaskBtn = document.getElementById("start-task");
startTaskBtn.addEventListener("click", () => {
	startTaskBtn.style.visibility = "hidden";
	createTaskWindow();
	addTaskBtnListener();
	closeTaskBtnListener();
});

function elementCreator(ele, id, classList, text, parent) {
	let element = document.createElement(ele);
	element.id = id;
	element.classList = classList;
	element.textContent = text;
	parent.appendChild(element);
}

function createProjectWindow() {
	elementCreator("div", "create-window", "", "", projectCon);
	const createWindow = document.getElementById("create-window");

	elementCreator("form", "create-form", "", "", createWindow);
	const createForm = document.getElementById("create-form");

	elementCreator("div", "input-con", "", "", createForm);
	const inputCon = document.getElementById("input-con");

	elementCreator("input", "title-input", "", "", inputCon);
	const titleInput = document.getElementById("title-input");
	titleInput.type = "text";
	titleInput.placeholder = "Project Title";

	elementCreator("input", "due-input", "", "", inputCon);
	const dueInput = document.getElementById("due-input");
	dueInput.type = "date";

	elementCreator("button", "add-button", "btn", "Add", createForm);

	elementCreator("button", "close-btn", "btn", "Close", createForm);

	startProjectBtn.classList.toggle("display-none");
}

//Array which stores all project objects
let myProjects = [];

const projectFactory = (title, due, tasks) => {
	return { title, due, tasks };
};

//This stringifies and sets the whole myProjects array instead of individual objects to maintain order
//myProjects is parsed in getLocalStorage()
function setLocalStorage() {
	localStorage.clear();

	let projects_serialized = JSON.stringify(myProjects);
	localStorage.setItem("projects", projects_serialized);
}

//Creates a project object using projectFactory() and pushes it to myProjects
function addBtnListener() {
	const addBtn = document.getElementById("add-button");
	const titleInput = document.getElementById("title-input");
	const dueInput = document.getElementById("due-input");
	addBtn.addEventListener("click", (event) => {
		event.preventDefault();
		startProjectBtn.style.display = "inline-block";

		const project = projectFactory(titleInput.value, dueInput.value, []);
		myProjects.push(project);
		createProjectCard();
		openProjectListener();

		document.getElementById("create-window").remove();
	});
}

//This is also called in openProjectListener() so the project cards render properly
function closeProjectBtn() {
	const createWindow = document.getElementById("create-window");
	if (createWindow) {
		createWindow.remove();
		startProjectBtn.style.visibility = "visible";
	}
}

function closeBtnListener() {
	const closeBtn = document.getElementById("close-btn");
	closeBtn.addEventListener("click", (event) => {
		event.preventDefault();

		closeProjectBtn();
	});
}

//This removes all project cards before calling a for loop to render an updated set of project cards
function createProjectCard() {
	const oldProjectCard = document.querySelectorAll(".project-card");
	oldProjectCard.forEach((card) => {
		card.remove();
	});

	for (let i = 0; i < myProjects.length; i++) {
		const projectCard = document.createElement("div");
		projectCard.className = "project-card";
		projectCon.insertBefore(projectCard, startProjectBtn);

		const cardInfoCon = document.createElement("div"); //Container used for styling
		cardInfoCon.className = "card-info-con";
		projectCard.appendChild(cardInfoCon);

		const cardTitle = document.createElement("h2");
		cardTitle.textContent = myProjects[i].title;
		cardInfoCon.appendChild(cardTitle);

		const dueTaskCon = document.createElement("div"); //Container used for styling
		dueTaskCon.className = "due-task-con";
		cardInfoCon.appendChild(dueTaskCon);

		const cardDue = document.createElement("span");
		cardDue.innerHTML = "<b>Due: </b>" + myProjects[i].due;
		dueTaskCon.appendChild(cardDue);

		const cardTasks = document.createElement("span");
		cardTasks.className = "card-tasks";
		cardTasks.innerHTML = "<b>Tasks: </b>" + myProjects[i].tasks.length;
		dueTaskCon.appendChild(cardTasks);

		const openProjectBtn = document.createElement("button");
		openProjectBtn.classList = "open-project-btn btn";
		openProjectBtn.setAttribute("data-index", i); //Indexes are given to buttons that match their project's index in myProjects array
		openProjectBtn.textContent = "Open Project";
		projectCard.appendChild(openProjectBtn);

		const deleteProjectBtn = document.createElement("button");
		deleteProjectBtn.classList = "material-icons delete-project-btn btn";
		deleteProjectBtn.setAttribute("data-index", i); //Indexes are given to buttons that match their project's index in myProjects array
		deleteProjectBtn.textContent = "close";
		projectCard.appendChild(deleteProjectBtn);
	}
	openProjectListener();
	deleteProjectListener();
	setLocalStorage();
}

//Hides the project window and displays a project's tasks in a new window
//This first displays taskCon and sets index as data- attribute before disabling projectCon
//It's important taskCon and projectCon are briefly displayed simultaneously to set data-index
function openProjectListener() {
	const openProjectBtn = document.querySelectorAll(".open-project-btn");
	openProjectBtn.forEach((btn) => {
		const index = btn.dataset.index; //index is used to match button to project object in myProjects
		btn.addEventListener("click", () => {
			taskCon.classList.remove("display-none");
			taskCon.setAttribute("data-index", index);
			projectCon.className = "display-none";

			document.getElementById("task-h2").textContent = myProjects[index].title;

			closeProjectBtn();
			createTaskCard();
		});
	});
}

function deleteProjectListener() {
	const deleteProjectBtn = document.querySelectorAll(".delete-project-btn");
	for (let i = 0; i < deleteProjectBtn.length; i++) {
		deleteProjectBtn[i].addEventListener("click", () => {
			myProjects.splice(i, 1);

			createProjectCard();
		});
	}
}

const backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", () => {
	closeTaskBtn();

	projectCon.classList.remove("display-none");
	taskCon.className = "display-none";

	createProjectCard();
});

function createTaskWindow() {
	const createWindow = document.createElement("div");
	createWindow.id = "create-window";
	taskCon.insertBefore(createWindow, startTaskBtn);

	const createForm = document.createElement("form");
	createWindow.appendChild(createForm);

	const descriptionInput = document.createElement("input");
	descriptionInput.type = "text";
	descriptionInput.id = "description-input";
	descriptionInput.placeholder = "Task Description";
	createForm.appendChild(descriptionInput);

	const createBtnCon = document.createElement("div");
	createForm.appendChild(createBtnCon);

	const addTaskBtn = document.createElement("button");
	addTaskBtn.id = "add-task-btn";
	addTaskBtn.className = "btn";
	addTaskBtn.textContent = "Add";
	createBtnCon.appendChild(addTaskBtn);

	const closeBtn = document.createElement("button");
	closeBtn.id = "close-task-btn";
	closeBtn.className = "btn";
	closeBtn.textContent = "Close";
	createBtnCon.appendChild(closeBtn);
}

const taskFactory = (description) => {
	return { description };
};

//Creates a task object using taskFactory() and pushes it to project's task value
//Uses taskCon.dataset.index to target the correct project
function addTaskBtnListener() {
	const addTaskBtn = document.getElementById("add-task-btn");
	const descriptionInput = document.getElementById("description-input");
	addTaskBtn.addEventListener("click", (event) => {
		event.preventDefault();
		startTaskBtn.style.visibility = "visible";

		const task = taskFactory(descriptionInput.value);
		myProjects[taskCon.dataset.index].tasks.push(task);
		createTaskCard();

		document.getElementById("create-window").remove();
	});
}

//This is also called in backBtn's eventListner so the task cards are rendered properly if needed
function closeTaskBtn() {
	const createWindow = document.getElementById("create-window");
	if (createWindow) {
		createWindow.remove();
		startTaskBtn.style.visibility = "visible";
	}
}

function closeTaskBtnListener() {
	const closeBtn = document.getElementById("close-task-btn");
	closeBtn.addEventListener("click", (event) => {
		event.preventDefault();

		closeTaskBtn();
	});
}

//This removes all task cards before calling a for loop to render an updated set of task cards
function createTaskCard() {
	const oldTaskCard = document.querySelectorAll(".task-card");
	oldTaskCard.forEach((card) => {
		card.remove();
	});

	const taskData = taskCon.dataset.index;
	for (let i = 0; i < myProjects[taskData].tasks.length; i++) {
		const taskCard = document.createElement("div");
		taskCard.className = "task-card";
		taskCon.insertBefore(taskCard, startTaskBtn);

		const cardDescription = document.createElement("h2");
		cardDescription.textContent = myProjects[taskData].tasks[i].description;
		taskCard.appendChild(cardDescription);

		const orderBtnCon = document.createElement("div"); //Container used for styling
		taskCard.appendChild(orderBtnCon);

		const orderUpBtn = document.createElement("button");
		orderUpBtn.textContent = "expand_less";
		orderUpBtn.classList = "material-icons order-up-btn btn";
		orderUpBtn.setAttribute("data-index", i); //Indexes are given to order buttons that match their task's index in it's array
		orderBtnCon.appendChild(orderUpBtn);

		const orderDownBtn = document.createElement("button");
		orderDownBtn.textContent = "expand_more";
		orderDownBtn.classList = "material-icons order-down-btn btn";
		orderDownBtn.setAttribute("data-index", i); //Indexes are given to order buttons that match their task's index in it's array
		orderBtnCon.appendChild(orderDownBtn);

		const deleteTaskBtn = document.createElement("button");
		deleteTaskBtn.classList = "material-icons delete-task-btn btn";
		deleteTaskBtn.textContent = "close";
		taskCard.appendChild(deleteTaskBtn);
	}
	orderBtnListener();
	deleteTaskListener();
	setLocalStorage();
}

function orderBtnListener() {
	const orderUpBtn = document.querySelectorAll(".order-up-btn");
	const orderDownBtn = document.querySelectorAll(".order-down-btn");

	const taskData = taskCon.dataset.index;
	const project = myProjects[taskData];
	orderUpBtn.forEach((btn) => {
		const btnData = btn.dataset.index;
		btn.addEventListener("click", () => {
			//The if statement prevents the up button from swapping places with the [1] element if in [0]
			if (btnData == 0) {
			} else {
				const element = project.tasks.splice(btnData, 1)[0];
				const index = btnData - 1;
				project.tasks.splice(index, 0, element);

				createTaskCard();
			}
		});
	});

	//This for loop worked while a copy of the previous forEach() with + instead of - did not
	//It required the use of i instead of btnData to work as well
	for (let i = 0; i < orderDownBtn.length; i++) {
		orderDownBtn[i].addEventListener("click", () => {
			const element = project.tasks.splice(i, 1)[0];
			const index = i + 1;
			project.tasks.splice(index, 0, element);

			createTaskCard();
		});
	}
}

function deleteTaskListener() {
	const deleteTaskBtn = document.querySelectorAll(".delete-task-btn");
	const taskConIndex = taskCon.dataset.index;
	for (let i = 0; i < deleteTaskBtn.length; i++) {
		deleteTaskBtn[i].addEventListener("click", () => {
			myProjects[taskConIndex].tasks.splice(i, 1);

			createTaskCard();
		});
	}
}

//Parses myProjects stored in local storage under "projects"
function getLocalStorage() {
	let project_deserialized = JSON.parse(localStorage.getItem("projects"));
	if (project_deserialized === null) {
		myProjects = [];
	} else {
		myProjects = project_deserialized;
	}
}

getLocalStorage();
createProjectCard();
