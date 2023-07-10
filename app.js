const docToDoGiriniz = document.querySelector("#todoName");
const btnToDoEkleyin = document.querySelector("#todoAddButton");
const btnTumToDolariTemizle = document.querySelector("#clearButton");
const listOfToDos = document.querySelector(".list-group");
const cardBody = document.querySelector(".card-body");
const toDoArayiniz = document.querySelector("#todoSearch");

let allToDos = [];
let toDoIsmi;
let isWarningOpen = false;
let filteredTodos;

document.addEventListener("DOMContentLoaded", pageLoad);
btnToDoEkleyin.addEventListener("click", toDoEkle);
btnTumToDolariTemizle.addEventListener("click", deleteAllToDos);
docToDoGiriniz.addEventListener("keyup", getToDoIsmi);
listOfToDos.addEventListener("click", deleteToDo);
toDoArayiniz.addEventListener("keyup", filterTodos);

function filterTodos(e) {
    while (listOfToDos.children.length > 0) {
        listOfToDos.removeChild(listOfToDos.children[0]);
    }
    filterTodosFromStorage(e);
    filteredTodos.forEach(function (todo) {
        addTodoToUI(todo[0]);
    });

}

function filterTodosFromStorage(e) {
    let todos = JSON.parse(localStorage.getItem("Todos"));
    filteredTodos = todos.filter(function (todo) {
        return todo[0].toLowerCase().includes(e.target.value.toLowerCase());
    });
}

function deleteToDo(e) {
    let li = e.target.parentElement.parentElement;
    if (e.target.className === "fa fa-remove") {
        deleteTodoFromUI(li);
        deleteTodoFromStorage(li);
        showAlert("success", (li.textContent + " başarıyla silindii.."));
    } else if(e.target.className === "list-group-item d-flex justify-content-between") {
        lineThrough(e);
    }
}

function lineThrough(e) {
    if(e.target.style.textDecoration === "line-through") {
        e.target.style.textDecoration = "none";
        allToDos = JSON.parse(localStorage.getItem("Todos"));
        allToDos.forEach(function(todo, index) {
            if(todo[0] === e.target.textContent) {
                allToDos.splice(index, 1, [todo[0], "false"]);
                localStorage.setItem("Todos", JSON.stringify(allToDos));
                return;
            }
        });
    } else {
        e.target.style.textDecoration = "line-through";
        allToDos = JSON.parse(localStorage.getItem("Todos"));
        allToDos.forEach(function(todo, index) {
            if(todo[0] === e.target.textContent) {
                allToDos.splice(index, 1, [todo[0], "true"]);
                localStorage.setItem("Todos", JSON.stringify(allToDos));
                return;
            }
        });
    }
    
}

function deleteTodoFromStorage(deletingToDo) {

    allToDos.forEach(function(value, index) {
        console.log(value[0] + "," + deletingToDo.textContent);
        if(value[0] === deletingToDo.textContent) {
            allToDos.splice(index, 1);
        }
    });

    localStorage.setItem("Todos", JSON.stringify(allToDos));

}

function deleteTodoFromUI(todo) {
    todo.remove();
}
function pageLoad() {
    allToDos = JSON.parse(localStorage.getItem("Todos"));
    if (allToDos != null || allToDos != undefined) {
        let alltodo = JSON.parse(localStorage.getItem("Todos"));
        alltodo.forEach(function (todo) {
            addTodoToUI(todo[0], todo[1]);
        });
    } else {
        allToDos = [];
    }
}

function deleteAllToDos() {

    while (listOfToDos.children.length > 0) {
        listOfToDos.removeChild(listOfToDos.children[0]);
    }
    allToDos = [];
    localStorage.setItem("Todos", null);
    showAlert("success", "Tüm todolar silindi...");
}

function getToDoIsmi() {
    toDoIsmi = docToDoGiriniz.value;
}

function toDoEkle() {

    if ((toDoIsmi === undefined) || (toDoIsmi === "") || (toDoIsmi === null)) {
        showAlert("danger", "Lütfen bu alanı boş bırakmayınız..");
        return;
    }
    let addingTodo = [toDoIsmi, "false"];
    allToDos.push(addingTodo);
    addTodoToUI(toDoIsmi);
    addTodoToStorage();
    showAlert("success", "Başarıyla eklendi...");
    
}


function addTodoToStorage() {
    localStorage.setItem("Todos", JSON.stringify(allToDos));
}

function addTodoToUI(newtodo, isLineThrough) {
    
    let list = document.createElement("li");
    let link = document.createElement("a");
    let i = document.createElement("i");

    list.className = "list-group-item d-flex justify-content-between";
    list.innerHTML = newtodo;
    list.style.backgroundColor = "#D3D3D3"

    link.href = "#";
    link.className = "delete-item";

    i.className = "fa fa-remove";

    link.appendChild(i);
    list.appendChild(link);

    if(isLineThrough === "true") {
        addLineThrough(list);
    }

    listOfToDos.appendChild(list);

    toDoIsmi = undefined;
    docToDoGiriniz.value = "";
}

function addLineThrough(todo) {
    todo.style.textDecoration = "line-through";
}

function showAlert(type, message) {
    let div = document.createElement("div");
    div.className = "alert alert-" + type;
    div.role = "alert";
    div.textContent = message;
    div.style.marginTop = "10px";
    div.style.marginBottom = "0";

    cardBody.appendChild(div);

    setTimeout(function() {
        div.remove();
    }, 2500);
}