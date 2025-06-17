const BASE_URL = "https://koola-mcf3.onrender.com/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "./index.html";
}
const todoForm = document.querySelector("#todo-form");
const todoInput = document.getElementById("todo-input");
const addInput = document.getElementById("add-button");
const todoList = document.querySelector("#todo-list");
const itemsLeft = document.querySelector(".items-left span");
const clearCompleted = document.querySelector(".clear");
const TaskState = {
  ACTIVE: "active",
  COMPLETED: "completed",
  DELETED: "deleted"
};

document.querySelector(".logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href ="./index.html#login";
});

let allTodos = [];

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

async function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
   try {
    const response = await fetch(`${BASE_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        text: todoText
      })
    });

    if (response.ok) {
      const newTodo = await response.json();

      const allRadio = document.querySelector("#all");
      allRadio.checked = true;

      filterTodoItems("all");

      createTodoItem(newTodo);
      todoInput.value = "";
    } else {
      const error = await response.json();
      alert(error.message || "Failed to create todo");
    }
   } catch (error) {
    console.error("Error creating todo", error);
    alert("Failed to create todo. PLease try again.")
   }
  }
}

function createTodoItem(todo) {
  const todoLI = document.createElement("li");
  todoLI.classList.add("flex-row");
  todoLI.setAttribute("data-id", todo._id);
  todoLI.setAttribute("data-state", todo.state);
  todoLI.setAttribute("data-order", todo.order);
  todoLI.innerHTML = `
    <label class="list-item">
      <input type="checkbox" name="todo-item" class="todo-checkbox" ${todo.state === TaskState.COMPLETED ? "checked" : ""}>
      <span class="todo-text">${todo.text}</span>
    </label>
    <button class="delete-button"><img src="./assets/close.svg" alt="Delete icon" class="delete-icon"></button>
  `;

  const existingItems = Array.from(todoList.children);
  const insertIndex = existingItems.findIndex(item => 
    Number(item.getAttribute("data-order")) < todo.order
  );

  if (insertIndex === -1) {
    todoList.appendChild(todoLI);
  } else {
    todoList.insertBefore(todoLI, existingItems[insertIndex]);
  }

  if (todo.state === TaskState.ACTIVE) {
    updateItemsCount(1);
  }
}

async function loadTodos() {
  try {
    const response = await fetch(`${BASE_URL}/todos`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      const todos = await response.json();
      todos.sort((a,b) => b.order - a.order).forEach(todo => {
        createTodoItem(todo);
      });
    } else {
      console.error ("Failed to load todos");
    } 
  } catch (error) {
    console.error("Error loading todos:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadTodos);

async function updateTodoState(todoId, state) {
  try {
    const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ state })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update todo state");
    }
  } catch (error) {
    console.error("Error updating todo state:", error);
    alert("Failed to update todo state. Please try again.");
  }
};

async function deleteTodo(todoId) {
  try {
    const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete todo");
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    alert("Failed to delete todo. Please try again.");
  }
}

function updateItemsCount(number) {
  itemsLeft.innerText = Number(itemsLeft.innerText) + number;
}

function removeTodoItem(todoLI) {
  if (!todoLI) return;

  const checkbox = todoLI.querySelector(".todo-checkbox");
  const wasCompleted = checkbox && checkbox.checked;

  if (todoLI.remove) {
    todoLI.remove();
  } else {
    todoLI.parentNode.removeChild(todoLI);
  }

  if (!wasCompleted) {
    updateItemsCount(-1);
  }
}

todoList.addEventListener("click", async function(e) {
  if (e.target.classList.contains("delete-button") || e.target.classList.contains("delete-icon")) {
    const todoItem = e.target.closest("li");
    if (todoItem) {
      const todoId = todoItem.getAttribute("data-id");
      await deleteTodo(todoId);
      removeTodoItem(todoItem);
    }
  }
});

todoList.addEventListener("change", async function(e) {
  if (e.target.classList.contains("todo-checkbox")) {
    const todoItem = e.target.closest("li");
    const todoId = todoItem.getAttribute("data-id");
    const newState = e.target.checked ? TaskState.COMPLETED : TaskState.ACTIVE;
    
    await updateTodoState(todoId, newState);
    todoItem.setAttribute("data-state", newState);
    
    if (e.target.checked) {
      updateItemsCount(-1);
    } else {
      updateItemsCount(1);
    }
  }
});




function filterTodoItems(id) {
  const allItems = todoList.querySelectorAll("li");

  allItems.forEach(item => {
    const state = item.getAttribute("data-state");
    
    switch(id) {
      case "all":
        item.style.display = "flex";
        break;
        
      case "active":
        item.style.display = state === TaskState.ACTIVE ? "flex" : "none";
        break;
        
      case "completed":
        item.style.display = state === TaskState.COMPLETED ? "flex" : "none";
        break;
    }
  });
}
  
  document.querySelector(".clear").addEventListener("click", async () => {
    const completedItems = todoList.querySelectorAll(`li[data-state="${TaskState.COMPLETED}"]`);
    
    for (const item of completedItems) {
      const todoId = item.getAttribute("data-id");
      try {
        await deleteTodo(todoId);
        item.remove();
      } catch (error) {
        console.error(`Failed to delete todo ${todoId}:`, error);
      }
    }
  });

document.querySelectorAll(".filter input[type='radio']"). forEach(radio => {
  radio.addEventListener("change", (e) => {
    filterTodoItems(e.target.id);
  });
});