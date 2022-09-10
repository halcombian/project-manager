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
	startProjectBtn.style.display = "none"; //classList.toggle("display-none") doesn't work with startProjectBtn
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

//Used to quickly give attributes to elements
//Adding createElement and appendChild to the function proved more trouble than worth
//Some elements use insertBefore, so appendChild causes problems with those
function elementCreator(element, id, classList, text) {
	element.id = id;
	element.classList = classList;
	element.textContent = text;
}

function createProjectWindow() {
	const createWindow = document.createElement("div");
	elementCreator(createWindow, "create-window", "", "");
	projectCon.insertBefore(createWindow, startProjectBtn);

	const createForm = document.createElement("form");
	elementCreator(createForm, "create-form", "", "");
	createWindow.appendChild(createForm);

	const inputCon = document.createElement("div");
	elementCreator(inputCon, "input-con", "", "");
	createForm.appendChild(inputCon);

	const titleInput = document.createElement("input");
	elementCreator(titleInput, "title-input", "", "");
	titleInput.type = "text";
	titleInput.placeholder = "Project Title";
	inputCon.appendChild(titleInput);

	const dueInput = document.createElement("input");
	elementCreator(dueInput, "due-input", "", "");
	dueInput.type = "date";
	inputCon.appendChild(dueInput);

	const addBtn = document.createElement("button");
	elementCreator(addBtn, "add-button", "btn", "Add");
	createForm.appendChild(addBtn);

	const closeBtn = document.createElement("button");
	elementCreator(closeBtn, "close-btn", "btn", "Close");
	createForm.appendChild(closeBtn);

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

	const projects_serialized = JSON.stringify(myProjects);
	localStorage.setItem("projects", projects_serialized);
}

//Checks which container element is currently displayed and returns matching text for validateInput()
function checkContainer() {
	if (projectCon.classList != "display-none") {
		return { blank: "leave project title blank", delete: "delete project" };
	} else {
		return { blank: "leave task description blank", delete: "delete task" };
	}
}

//Creates window that validates user inputs
//Takes strings from checkContainer and displays the appropriate text-
//depending on if "yes" or "no" button is clicked and which container is displayed
function validateInput(checkContainerText) {
	const validationCon = document.createElement("div");
	elementCreator(validationCon, "validation-con", "", "");
	document.getElementById("main-page").appendChild(validationCon);

	const validationMessage = document.createElement("span");
	elementCreator(
		validationMessage,
		"validation-message",
		"",
		`Do you want to ${checkContainerText}?`
	);
	validationCon.appendChild(validationMessage);

	const btnCon = document.createElement("div");
	validationCon.appendChild(btnCon);

	const yesBtn = document.createElement("button");
	elementCreator(yesBtn, "yes-btn", "btn", "Yes");
	btnCon.appendChild(yesBtn);

	const noBtn = document.createElement("button");
	elementCreator(noBtn, "no-btn", "btn", "No");
	btnCon.appendChild(noBtn);
}

//Confirms user input
//Allows user to create blank project or task depending on which container is displayed
//Also allows user to delete projects or tasks in the same manner
function yesBtnListener() {
	const validationCon = document.getElementById("validation-con");
	const yesBtn = document.getElementById("yes-btn");
	yesBtn.addEventListener("click", () => {
		if (projectCon.classList != "display-none") {
			if (document.getElementById("create-window")) {
				addProject();
			} else {
				deleteProject();
			}
		} else {
			if (document.getElementById("create-window")) {
				addTask();
			} else {
				deleteTask();
			}
		}
		const otherBtns = document.querySelectorAll(".btn");
		otherBtns.forEach((btn) => {
			btn.disabled = false;
		});
		validationCon.remove();
	});
}

//Similar to "yes" btn, this removes validation window and, if title or description input is rendered,-
//focuses input for ease of use
function noBtnListener() {
	const validationCon = document.getElementById("validation-con");
	const noBtn = document.getElementById("no-btn");
	const titleInput = document.getElementById("title-input");
	const descriptionInput = document.getElementById("description-input");
	noBtn.addEventListener("click", () => {
		validationCon.remove();
		if (document.getElementById("create-window")) {
			if (projectCon.classList != "display-none") {
				titleInput.focus();
			} else {
				descriptionInput.focus();
			}
		}
		const otherBtns = document.querySelectorAll(".btn");
		otherBtns.forEach((btn) => {
			btn.disabled = false;
		});
	});
}

function disableBtns() {
	const otherBtns = document.querySelectorAll(".btn");
	const yesBtn = document.getElementById("yes-btn");
	const noBtn = document.getElementById("no-btn");
	otherBtns.forEach((btn) => {
		btn.disabled = true;
	});
	yesBtn.disabled = false;
	noBtn.disabled = false;
}

function createValidationWindow(checkContainerText) {
	checkContainer();
	validateInput(checkContainerText);
	yesBtnListener();
	noBtnListener();
	disableBtns();
}

//Checks if title-input is left blank
//Also checks if yes-btn isn't on the dom so that, if it is, validation window is created
//Else creates a project object
function addProject() {
	const titleInput = document.getElementById("title-input");
	const dueInput = document.getElementById("due-input");
	if ((titleInput.value == "") & !document.getElementById("yes-btn")) {
		createValidationWindow(checkContainer().blank);
	} else {
		const project = projectFactory(titleInput.value, dueInput.value, []);
		myProjects.push(project);
		createProjectCard();
		openProjectListener();

		startProjectBtn.style.display = "inline-block";
		document.getElementById("create-window").remove();
	}
}

//Creates a project object using projectFactory() and pushes it to myProjects
function addBtnListener() {
	const addBtn = document.getElementById("add-button");
	addBtn.addEventListener("click", (event) => {
		event.preventDefault();
		addProject();
	});
}

//This is also called in openProjectListener() so the project cards render properly
function closeProjectBtn() {
	const createWindow = document.getElementById("create-window");
	if (createWindow) {
		createWindow.remove();
		startProjectBtn.style.display = "inline-block";
	}
}

function closeBtnListener() {
	const closeBtn = document.getElementById("close-btn");
	closeBtn.addEventListener("click", (event) => {
		event.preventDefault();

		closeProjectBtn();
	});
}

//Removes all project cards before calling a for loop to render an updated set of project cards
function createProjectCard() {
	const oldProjectCard = document.querySelectorAll(".project-card");
	oldProjectCard.forEach((card) => {
		card.remove();
	});

	for (let i = 0; i < myProjects.length; i++) {
		const projectCard = document.createElement("div");
		projectCard.className = "project-card";
		projectCon.insertBefore(projectCard, startProjectBtn);

		const cardInfoCon = document.createElement("div");
		elementCreator(cardInfoCon, "", "card-info-con", "");
		projectCard.appendChild(cardInfoCon);

		const cardTitle = document.createElement("h2");
		elementCreator(cardTitle, "", "", myProjects[i].title);
		cardInfoCon.appendChild(cardTitle);

		const dueTaskCon = document.createElement("div");
		elementCreator(dueTaskCon, "", "due-task-con", "");
		cardInfoCon.appendChild(dueTaskCon);

		const cardDue = document.createElement("span");
		elementCreator(cardDue, "", "", "Due: " + myProjects[i].due);
		cardInfoCon.appendChild(cardDue);

		const cardTasks = document.createElement("span");
		elementCreator(
			cardTasks,
			"",
			"card-tasks",
			"Tasks: " + myProjects[i].tasks.length
		);
		cardInfoCon.appendChild(cardTasks);

		const openProjectBtn = document.createElement("button");
		elementCreator(openProjectBtn, "", "open-project-btn btn", "Open Project");
		openProjectBtn.setAttribute("data-index", i);
		projectCard.appendChild(openProjectBtn);

		const deleteProjectBtn = document.createElement("button");
		elementCreator(
			deleteProjectBtn,
			"",
			"material-icons delete-project-btn btn",
			"close"
		);
		deleteProjectBtn.setAttribute("data-index", i);
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

//Creates validation window to confirm user wants to delete project
//Passes deleteProjectBtn's data-index to validationCon so "yes" btn knows which project to target
function deleteProjectListener() {
	const deleteProjectBtn = document.querySelectorAll(".delete-project-btn");
	deleteProjectBtn.forEach((btn) => {
		const index = btn.dataset.index;
		btn.addEventListener("click", () => {
			createValidationWindow(checkContainer().delete);

			const validationCon = document.getElementById("validation-con");
			validationCon.setAttribute("data-index", index);
		});
	});
}

//Is called by the "yes" btn to delete the targeted project
function deleteProject() {
	const validationCon = document.getElementById("validation-con");
	const valIndex = validationCon.dataset.index;
	myProjects.splice(valIndex, 1);

	createProjectCard();
}

//Returns user to projectCon window
const backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", () => {
	closeTaskBtn();

	projectCon.classList.remove("display-none");
	taskCon.className = "display-none";

	createProjectCard();
});

function createTaskWindow() {
	const createWindow = document.createElement("div");
	elementCreator(createWindow, "create-window", "", "");
	taskCon.insertBefore(createWindow, startTaskBtn);

	const createForm = document.createElement("form");
	elementCreator(createForm, "", "", "");
	createWindow.appendChild(createForm);

	const descriptionInput = document.createElement("input");
	elementCreator(descriptionInput, "description-input", "", "");
	descriptionInput.type = "text";
	descriptionInput.placeholder = "Task Description";
	createForm.appendChild(descriptionInput);

	const createBtnCon = document.createElement("div");
	createForm.appendChild(createBtnCon);

	const addTaskBtn = document.createElement("button");
	elementCreator(addTaskBtn, "add-task-btn", "btn", "Add");
	createBtnCon.appendChild(addTaskBtn);

	const closeBtn = document.createElement("button");
	elementCreator(closeBtn, "close-task-btn", "btn", "Close");
	createBtnCon.appendChild(closeBtn);
}

const taskFactory = (description) => {
	return { description };
};

//Checks if description-input is left blank
//Also checks if yes-btn isn't on the dom so that, if it is, validation window is created
//Else creates a task object
function addTask() {
	const descriptionInput = document.getElementById("description-input");
	if ((descriptionInput.value == "") & !document.getElementById("yes-btn")) {
		createValidationWindow(checkContainer().blank);
	} else {
		const task = taskFactory(descriptionInput.value);
		myProjects[taskCon.dataset.index].tasks.push(task);
		createTaskCard();

		startTaskBtn.style.visibility = "visible";
		document.getElementById("create-window").remove();
	}
}

//Creates a task object using taskFactory() and pushes it to project's task value
//Uses taskCon.dataset.index to target the correct project
function addTaskBtnListener() {
	const addTaskBtn = document.getElementById("add-task-btn");
	addTaskBtn.addEventListener("click", (event) => {
		event.preventDefault();
		addTask();
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
		elementCreator(taskCard, "", "task-card", "");
		taskCon.insertBefore(taskCard, startTaskBtn);

		const cardDescription = document.createElement("h2");
		elementCreator(
			cardDescription,
			"",
			"",
			myProjects[taskData].tasks[i].description
		);
		taskCard.appendChild(cardDescription);

		const orderBtnCon = document.createElement("div"); //Container used for styling
		taskCard.appendChild(orderBtnCon);

		const orderUpBtn = document.createElement("button");
		elementCreator(
			orderUpBtn,
			"",
			"material-icons order-up-btn btn",
			"expand_less"
		);
		orderUpBtn.setAttribute("data-index", i); //Indexes are given to order buttons that match their task's index in it's array
		orderBtnCon.appendChild(orderUpBtn);

		const orderDownBtn = document.createElement("button");
		elementCreator(
			orderDownBtn,
			"",
			"material-icons order-down-btn btn",
			"expand_more"
		);
		orderBtnCon.appendChild(orderDownBtn);

		const deleteTaskBtn = document.createElement("button");
		elementCreator(
			deleteTaskBtn,
			"",
			"material-icons delete-task-btn btn",
			"close"
		);
		deleteTaskBtn.setAttribute("data-index", i);
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
			//The if statement prevents the up button from swapping places with the second element if in first
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

//Creates validation window to confirm user wants to delete task
//Passes deleteTaskBtn's data-index to validationCon so "yes" btn knows which task to target
function deleteTaskListener() {
	const deleteTaskBtn = document.querySelectorAll(".delete-task-btn");
	deleteTaskBtn.forEach((btn) => {
		const index = btn.dataset.index;
		btn.addEventListener("click", () => {
			createValidationWindow(checkContainer().delete);

			const validationCon = document.getElementById("validation-con");
			validationCon.setAttribute("data-index", index);
		});
	});
}

//Deletes targeted task and creates new list of cards
function deleteTask() {
	const validationCon = document.getElementById("validation-con");
	const taskConIndex = taskCon.dataset.index;
	const valIndex = validationCon.dataset.index;
	myProjects[taskConIndex].tasks.splice(valIndex, 1);

	createTaskCard();
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
