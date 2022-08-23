//Gets projectCon to be used in createProjectWindow() and createProjectCards()
const projectCon = document.getElementById("project-con");
const startProjectBtn = document.getElementById("start-project");
startProjectBtn.addEventListener("click", () => {
	startProjectBtn.style.visibility = "hidden";
	createProjectWindow();
	addBtnListener();
});

const taskCon = document.getElementById("task-con");
const startTaskBtn = document.getElementById("start-task");
startTaskBtn.addEventListener("click", () => {
	startTaskBtn.style.visibility = "hidden";
	createTaskWindow();
	addTaskBtnListener();
});

function createProjectWindow() {
	const createWindow = document.createElement("div");
	createWindow.id = "create-window";
	projectCon.insertBefore(createWindow, startProjectBtn);

	const createForm = document.createElement("form");
	createWindow.appendChild(createForm);

	const titleInput = document.createElement("input");
	titleInput.type = "text";
	titleInput.setAttribute("required", "");
	titleInput.id = "title-input";
	titleInput.placeholder = "Project Title";
	createForm.appendChild(titleInput);

	const dueInput = document.createElement("input");
	dueInput.type = "date";
	dueInput.id = "due-input";
	dueInput.placeholder = "Due";
	createForm.appendChild(dueInput);

	const addBtn = document.createElement("button");
	addBtn.id = "add-button";
	addBtn.className = "btn";
	addBtn.textContent = "Add";
	createForm.appendChild(addBtn);
}

let myProjects = [
	/*
	{
		title: "Test Project 1",
		due: "",
		tasks: [
			{ description: "Test 1 Task 1", notes: "" },
			{ description: "Test 1 Task 2", notes: "" },
			{ description: "Test 1 Task 3", notes: "" },
		],
	},
	{
		title: "Test Project 2",
		due: "",
		tasks: [
			{ description: "Test 2 Task 1", notes: "" },
			{ description: "Test 2 Task 2", notes: "" },
			{ description: "Test 2 Task 3", notes: "" },
		],
	},
	{
		title: "Test Project 3",
		due: "",
		tasks: [
			{ description: "Test 3 Task 1", notes: "" },
			{ description: "Test 3 Task 2", notes: "" },
			{ description: "Test 3 Task 3", notes: "" },
		],
	},*/
];

const projectFactory = (title, due, tasks) => {
	return { title, due, tasks };
};

function addBtnListener() {
	const addBtn = document.getElementById("add-button");
	const titleInput = document.getElementById("title-input");
	const dueInput = document.getElementById("due-input");
	addBtn.addEventListener("click", (event) => {
		event.preventDefault();
		startProjectBtn.style.visibility = "visible";

		const project = projectFactory(titleInput.value, dueInput.value, []);
		myProjects.push(project);
		createProjectCard();
		openProjectListener();

		document.getElementById("create-window").remove();
	});
}

function createProjectCard() {
	const oldProjectCard = document.querySelectorAll(".project-card");
	oldProjectCard.forEach((card) => {
		card.remove();
	});

	for (let i = 0; i < myProjects.length; i++) {
		const projectCard = document.createElement("div");
		projectCard.className = "project-card";
		projectCon.insertBefore(projectCard, startProjectBtn);

		const cardTitle = document.createElement("h2");
		cardTitle.textContent = myProjects[i].title;
		projectCard.appendChild(cardTitle);

		const cardDue = document.createElement("span");
		cardDue.textContent = myProjects[i].due;
		projectCard.appendChild(cardDue);

		const openProjectBtn = document.createElement("button");
		openProjectBtn.className = "open-project-btn";
		openProjectBtn.setAttribute("data-index", i);
		openProjectBtn.textContent = "Open Project";
		projectCard.appendChild(openProjectBtn);
	}
}

function openProjectListener() {
	const openProjectBtn = document.querySelectorAll(".open-project-btn");
	for (let i = 0; i < openProjectBtn.length; i++) {
		openProjectBtn[i].addEventListener("click", () => {
			taskCon.classList.remove("display-none");
			taskCon.setAttribute("data-index", openProjectBtn[i].dataset.index);
			projectCon.className = "display-none";

			document.getElementById("task-h2").innerHTML =
				"<h2>" + myProjects[i].title + "</h2>";

			createTaskCard();
		});
	}
}

const backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", () => {
	projectCon.classList.remove("display-none");
	taskCon.className = "display-none";

	createTaskCard();
});

function createTaskWindow() {
	const createWindow = document.createElement("div");
	createWindow.id = "create-window";
	taskCon.insertBefore(createWindow, startTaskBtn);

	const createForm = document.createElement("form");
	createWindow.appendChild(createForm);

	const descriptionInput = document.createElement("input");
	descriptionInput.type = "text";
	descriptionInput.setAttribute("required", "");
	descriptionInput.id = "description-input";
	descriptionInput.placeholder = "Task Description";
	createForm.appendChild(descriptionInput);

	const notesInput = document.createElement("input");
	notesInput.type = "text";
	notesInput.id = "notes-input";
	notesInput.placeholder = "Notes";
	createForm.appendChild(notesInput);

	const addTaskBtn = document.createElement("button");
	addTaskBtn.id = "add-task-btn";
	addTaskBtn.className = "btn";
	addTaskBtn.textContent = "Add";
	createForm.appendChild(addTaskBtn);
}

const taskFactory = (description, notes) => {
	return { description, notes };
};

function addTaskBtnListener() {
	const addTaskBtn = document.getElementById("add-task-btn");
	const descriptionInput = document.getElementById("description-input");
	const notesInput = document.getElementById("notes-input");
	addTaskBtn.addEventListener("click", (event) => {
		event.preventDefault();
		startTaskBtn.style.visibility = "visible";

		const task = taskFactory(descriptionInput.value, notesInput.value);
		myProjects[taskCon.dataset.index].tasks.push(task);
		createTaskCard();

		document.getElementById("create-window").remove();
	});
}

function createTaskCard() {
	const oldTaskCard = document.querySelectorAll(".task-card");
	oldTaskCard.forEach((card) => {
		card.remove();
	});

	const taskData = taskCon.dataset.index;
	for (let j = 0; j < myProjects[taskData].tasks.length; j++) {
		const taskCard = document.createElement("div");
		taskCard.className = "task-card";
		taskCon.insertBefore(taskCard, startTaskBtn);

		const cardDescription = document.createElement("h2");
		cardDescription.textContent = myProjects[taskData].tasks[j].description;
		taskCard.appendChild(cardDescription);

		const cardNotes = document.createElement("span");
		cardNotes.textContent = myProjects[taskData].tasks[j].notes;
		taskCard.appendChild(cardNotes);
	}
}

//Called for testing
//createProjectCard();
//openProjectListener();
