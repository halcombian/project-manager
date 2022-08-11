const startBtn = document.getElementById("start-project");
startBtn.addEventListener("click", () => {
	startBtn.style.visibility = "hidden";
	createProjectWindow();
	addBtnListener();
});

//Gets project con to be used in createProjectWindow() and createProjectCards()
const projectCon = document.getElementById("project-con");

function createProjectWindow() {
	const createWindow = document.createElement("div");
	createWindow.id = "create-window";
	projectCon.appendChild(createWindow);

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

let myProjects = [];

const projectFactory = (title, due, tasks) => {
	return { title, due, tasks };
};

function addBtnListener() {
	const addBtn = document.getElementById("add-button");
	const titleInput = document.getElementById("title-input");
	const dueInput = document.getElementById("due-input");
	addBtn.addEventListener("click", (event) => {
		event.preventDefault();
		startBtn.style.visibility = "visible";

		const project = projectFactory(titleInput.value, dueInput.value, []);
		myProjects.push(project);
		createProjectCard();

		document.getElementById("create-window").remove();
	});
}

function createProjectCard() {
	//TODO: remove projectCon children before loop to avoid repeats <--
	for (let i = 0; i < myProjects.length; i++) {
		const projectCard = document.createElement("div");
		projectCard.className = "project-card";
		projectCon.appendChild(projectCard);

		const cardTitle = document.createElement("h2");
		cardTitle.textContent = myProjects[i].title;
		projectCard.appendChild(cardTitle);

		const cardDue = document.createElement("span");
		cardDue.textContent = myProjects[i].due;
		projectCard.appendChild(cardDue);

		const cardTasks = document.createElement("span");
		projectCard.appendChild(cardTasks);
	}
}
