const STORAGE_KEY = "it-study-planner-tasks";

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const errorEl = document.getElementById("error");
const listEl = document.getElementById("taskList");
const counterEl = document.getElementById("counter");
const filterBtns = document.querySelectorAll(".filter");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    errorEl.textContent = "Не удалось сохранить данные в браузере.";
  }
}

function addTask() {
  const title = input.value.trim();
  if (!title) {
    errorEl.textContent = "Введите название задачи.";
    return;
  }
  errorEl.textContent = "";
  tasks.push({ id: Date.now(), title: title, done: false });
  input.value = "";
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (task) task.done = !task.done;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  render();
}

function render() {
  listEl.innerHTML = "";
  const visible = tasks.filter(function (t) {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Задач пока нет. Добавьте первую.";
    listEl.appendChild(empty);
  }

  visible.forEach(function (t) {
    const li = document.createElement("li");
    li.className = "task" + (t.done ? " done" : "");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = t.done;
    check.setAttribute("aria-label", "Отметить выполненной");
    check.addEventListener("change", function () { toggleTask(t.id); });

    const text = document.createElement("span");
    text.textContent = t.title; // textContent защищает от вставки HTML-кода

    const del = document.createElement("button");
    del.type = "button";
    del.className = "del";
    del.textContent = "Удалить";
    del.addEventListener("click", function () { deleteTask(t.id); });

    li.append(check, text, del);
    listEl.appendChild(li);
  });

  const left = tasks.filter(function (t) { return !t.done; }).length;
  counterEl.textContent = "Осталось выполнить: " + left + " из " + tasks.length;
}

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});
filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
    render();
  });
});

render();
