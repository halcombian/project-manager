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
	createForm.appendChild(dueInput);

	const addBtn = document.createElement("button");
	addBtn.id = "add-button";
	addBtn.className = "btn";
	addBtn.textContent = "Add";
	createForm.appendChild(addBtn);
}

let myProjects = [
	{
		title: "Test Project 1",
		due: "2022-08-30",
		tasks: [
			{ description: "Test 1 Task 1", notes: "Test Note 1" },
			{ description: "Test 1 Task 2", notes: "Test Note 2" },
			{ description: "Test 1 Task 3", notes: "Test Note 3" },
		],
	},
	{
		title: "Test Project 2",
		due: "2022-09-15",
		tasks: [
			{ description: "Test 2 Task 1", notes: "Test Note 1" },
			{ description: "Test 2 Task 2", notes: "Test Note 2" },
			{ description: "Test 2 Task 3", notes: "Test Note 3" },
		],
	},
	{
		title: "Test Project 3",
		due: "2022-09-30",
		tasks: [
			{ description: "Test 3 Task 1", notes: "Test Note 1" },
			{ description: "Test 3 Task 2", notes: "Test Note 2" },
			{ description: "Test 3 Task 3", notes: "Test Note 3" },
		],
	},
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

		const cardInfoCon = document.createElement("div");
		cardInfoCon.className = "card-info-con";
		projectCard.appendChild(cardInfoCon);

		const cardTitle = document.createElement("h2");
		cardTitle.textContent = myProjects[i].title;
		cardInfoCon.appendChild(cardTitle);

		const dueTaskCon = document.createElement("div");
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
		openProjectBtn.setAttribute("data-index", i);
		openProjectBtn.textContent = "Open Project";
		projectCard.appendChild(openProjectBtn);

		const deleteProjectBtn = document.createElement("button");
		deleteProjectBtn.classList = "delete-project-btn btn";
		deleteProjectBtn.setAttribute("data-index", i);
		deleteProjectBtn.textContent = "Delete";
		projectCard.appendChild(deleteProjectBtn);
	}
	openProjectListener();
	deleteProjectListener();
}

function openProjectListener() {
	const openProjectBtn = document.querySelectorAll(".open-project-btn");
	openProjectBtn.forEach((btn) => {
		const index = btn.dataset.index;
		btn.addEventListener("click", () => {
			taskCon.classList.remove("display-none");
			taskCon.setAttribute("data-index", index);
			projectCon.className = "display-none";

			document.getElementById("task-h2").textContent = myProjects[index].title;

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
	descriptionInput.setAttribute("required", "");
	descriptionInput.id = "description-input";
	descriptionInput.placeholder = "Task Description";
	createForm.appendChild(descriptionInput);

	const addTaskBtn = document.createElement("button");
	addTaskBtn.id = "add-task-btn";
	addTaskBtn.className = "btn";
	addTaskBtn.textContent = "Add";
	createForm.appendChild(addTaskBtn);
}

const taskFactory = (description) => {
	return { description };
};

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

		const orderBtnCon = document.createElement("div");
		taskCard.appendChild(orderBtnCon);

		const orderUpBtn = document.createElement("button");
		orderUpBtn.textContent = "Up";
		orderUpBtn.classList = "order-up-btn btn";
		orderUpBtn.setAttribute("data-index", j);
		orderBtnCon.appendChild(orderUpBtn);

		const orderDownBtn = document.createElement("button");
		orderDownBtn.textContent = "Down";
		orderDownBtn.classList = "order-down-btn btn";
		orderDownBtn.setAttribute("data-index", j);
		orderBtnCon.appendChild(orderDownBtn);

		const deleteTaskBtn = document.createElement("button");
		deleteTaskBtn.classList = "delete-task-btn btn";
		deleteTaskBtn.textContent = "Delete";
		taskCard.appendChild(deleteTaskBtn);
	}
	orderBtnListener();
	deleteTaskListener();
}

function orderBtnListener() {
	const orderUpBtn = document.querySelectorAll(".order-up-btn");
	const orderDownBtn = document.querySelectorAll(".order-down-btn");

	const taskData = taskCon.dataset.index;
	const project = myProjects[taskData];
	orderUpBtn.forEach((btn) => {
		const btnData = btn.dataset.index;
		btn.addEventListener("click", () => {
			if (btnData == 0) {
			} else {
				const element = project.tasks.splice(btnData, 1)[0];
				const index = btnData - 1;
				project.tasks.splice(index, 0, element);

				createTaskCard();
			}
		});
	});

	orderDownBtn.forEach((btn) => {
		const btnData = btn.dataset.index;
		btn.addEventListener("click", () => {
			const element = project.tasks.splice(btnData, 1)[0];
			const index = btnData + 1;
			project.tasks.splice(index, 0, element);

			createTaskCard();
		});
	});
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

createProjectCard();
