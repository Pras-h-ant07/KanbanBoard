const addBtn = document.querySelector("#addBtn");
const addBtnSymbol = document.querySelector("#addBtn i");
const newTaskContainer = document.querySelector(".new-ticket-box");
const newTaskPanelColorsList = document.querySelectorAll(".panel-btn");
const newTaskTextArea = document.querySelector(".text-area");
const ticketContainer = document.querySelector(".ticket-container");
const deleteBtn = document.querySelector(".remove-btn");
const actionBox = document.querySelector(".actionBox");
const filterPanel = document.querySelectorAll(".colorbox");
const colorList = ["colorBox1", "colorBox2", "colorBox3", "colorBox4"];

let showAddTicketContainer = false;
let selectedColor = "colorBox1";
let unlockTicketEdit = false;
let deleteBtnStatus = false;
let allTicketsList = [];

// CREATE A NEW TICKET....................................................
//to show the add-a-new-task box
addBtn.addEventListener("click", () => {
  showAddTicketContainer = !showAddTicketContainer;
  if (showAddTicketContainer && !deleteBtnStatus) {
    newTaskContainer.style.display = "flex";
    addBtnSymbol.classList.remove("fa-plus");
    addBtnSymbol.classList.add("fa-multiply");
  } else if (showAddTicketContainer && deleteBtnStatus) {
    alert("DELETE mode is ON, turn it OFF to Add a new Task");
    showAddTicketContainer = !showAddTicketContainer;
  } else {
    newTaskContainer.style.display = "none";
    addBtnSymbol.classList.remove("fa-multiply");
    addBtnSymbol.classList.add("fa-plus");
    newTaskTextArea.value = "";
  }
});

//to select color band on the task box
newTaskPanelColorsList.forEach((colorBtn) => {
  colorBtn.addEventListener("click", (e) => {
    selectedColor = e.target.classList[1];
    newTaskPanelColorsList.forEach((element) => {
      element.classList.remove("select");
    });
    e.target.classList.add("select");
  });
});

// to add the written text as a ticket
newTaskContainer.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && newTaskTextArea.value) {
    let tktId = generateId();
    const newTask = "&rarr; " + newTaskTextArea.value
    generateTicket(selectedColor, tktId, newTask);
    //adding ticket to "allTicketsList" array
    allTicketsList.push({
      id: tktId,
      color: selectedColor,
      task: newTask,
    });
    //adding ticket to LOCAL STORAGE
    localStorage.setItem("AllTickets", JSON.stringify(allTicketsList));
    // closing the add-new-ticket container
    showAddTicketContainer = !showAddTicketContainer;
    newTaskContainer.style.display = "none";
    newTaskTextArea.value = "";
    addBtnSymbol.classList.remove("fa-multiply");
    addBtnSymbol.classList.add("fa-plus");
  }
});

// FUNCTIONS:
// to create unique id:
const generateId = () => {
  const id = "Task id: " + Math.random().toString(16).slice(2);
  return id;
};

//to generate a new ticket:
const generateTicket = (colorClass, id, task) => {
  const newTicket = document.createElement("div");
  newTicket.classList.add("ticket");
  newTicket.innerHTML = `<div id ="colorBand" class="ticket-color ${colorClass}"></div>
                        <div class="ticket-id">${id}</div>
                        <div class="ticket-task">
                          <div class="task-content">${task}</div>
                          <i id="lockIcon" class="fa-solid fa-lock"></i>
                        </div>`;
  ticketContainer.appendChild(newTicket);
};


// UPDATE A TICKET.........................................................
ticketContainer.addEventListener("click", (e) => {
  const selectedElm = e.target;
  // update the TASK of the ticket
  if (selectedElm.id === "lockIcon") {
    const ticket = e.target.parentElement.parentElement
    const ticketId =ticket.querySelector(".ticket-id").innerText;
    allTicketsList.forEach((tkt, idx) => {
      if (tkt.id === ticketId) {
        const newTaskTextArea =
        ticket.querySelector(".task-content");
        unlockTicketEdit = !unlockTicketEdit;
        if (unlockTicketEdit) {
          selectedElm.classList.remove("fa-lock");
          selectedElm.classList.add("fa-lock-open");
          newTaskTextArea.setAttribute("contenteditable", true);
          newTaskTextArea.style.cursor = "text";
        } else {
          selectedElm.classList.remove("fa-lock-open");
          selectedElm.classList.add("fa-lock");
          newTaskTextArea.removeAttribute("contenteditable");
          newTaskTextArea.style.cursor = "pointer";
          allTicketsList[idx].task = newTaskTextArea.innerText;
          localStorage.setItem("AllTickets", JSON.stringify(allTicketsList));
        }
      }
    });
  }
  // update the ticket COLOR
  if (selectedElm.id === "colorBand") {
    const ticket = e.target.parentElement
    const ticketId = ticket.querySelector(".ticket-id").innerText;
    allTicketsList.forEach((tkt, idx) => {
      if (tkt.id === ticketId) {
        let colorIndex = 0;
        const color = selectedElm.classList[1];
        colorList.forEach((elm, idx) => {
          if (elm == color) {
            colorIndex = idx;
            colorIndex == 3 ? (colorIndex = 0) : colorIndex++;
          }
        });
        selectedElm.classList.remove(color);
        selectedElm.classList.add(colorList[colorIndex]);
        allTicketsList[idx].color = colorList[colorIndex];
        localStorage.setItem("AllTickets", JSON.stringify(allTicketsList));
      }
    });
  }
});


// DELETE A TICKET ........................................................
deleteBtn.addEventListener("click", () => {
  deleteBtnStatus = !deleteBtnStatus;
  if (deleteBtnStatus) {
    deleteBtn.style.backgroundColor = "red";
  } else {
    deleteBtn.style.backgroundColor = "transparent";
  }
  let ticketsNode = document.querySelectorAll(".ticket");
  for (let i = 0; i < ticketsNode.length; i++) {
    ticketsNode[i].addEventListener("click", () => {
      allTicketsList.forEach((tkt, idx) => {
        if (deleteBtnStatus && i == idx) {
          allTicketsList.splice(i, 1);
          localStorage.setItem("AllTickets", JSON.stringify(allTicketsList));
          ticketsNode[i].remove();
        }
      });
    });
  }
});


// READ THE SAVED TICKETS FORM LOCAL STORAGE...............................
if (localStorage.getItem("AllTickets")) {
  allTicketsList = JSON.parse(localStorage.getItem("AllTickets"));
  if (allTicketsList !== null) {
    allTicketsList.forEach((ticket) => {
      generateTicket(ticket.color, ticket.id, ticket.task);
    });
  }
}

// FILTER THE TICKETS......................................................
filterPanel.forEach((filterBtn) => {
  // double click event
  filterBtn.addEventListener("dblclick", () => {
    const ticketsColorBandNode = document.querySelectorAll(".ticket-color");
    actionBox.style.display = "flex";
    filterPanel.forEach((btn) => {
      btn.classList.remove("selectedOnFilter");
    });
    for (let i = 0; i < ticketsColorBandNode.length; i++) {
      ticketsColorBandNode[i].parentElement.style.display = "flex";
    }
  });

  // single click event
  filterBtn.addEventListener("click", (e) => {
    const ticketsColorBandNode = document.querySelectorAll(".ticket-color");
    actionBox.style.display = "none";
    filterPanel.forEach((btn) => {
      btn.classList.remove("selectedOnFilter");
    });
    e.target.classList.add("selectedOnFilter");

    const color = e.target.classList[1];
    for (let i = 0; i < ticketsColorBandNode.length; i++) {
      if (ticketsColorBandNode[i].classList[1] === color) {
        ticketsColorBandNode[i].parentElement.style.display = "flex";
      } else {
        ticketsColorBandNode[i].parentElement.style.display = "none";
      }
    }
  });
});

