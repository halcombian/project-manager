const startBtn = document.getElementById("start-project");
startBtn.addEventListener("click", () => {
	startBtn.style.visibility = "hidden";
	createProjectWindow();
});

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

/*function createProjectCard() {
	const projectCard = document.createElement("div");
	projectCard.className = "project-card";
	projectCon.appendChild(projectCard);

	const cardTitle = document.createElement("h2");
	projectCard.appendChild(cardTitle);

	const cardDue = document.createElement("span");
	projectCard.appendChild(cardDue);

	const cardTasks = document.createElement("span");
	projectCard.appendChild(cardTasks);
}*/
