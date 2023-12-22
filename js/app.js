/* UTILITIES */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const showElement = (selector) => $(selector).classList.remove("hidden");
const hideElement = (selector) => $(selector).classList.add("hidden");

/* RENDER */
const newOperation = [
  {
    id: 1,
    description: "Viajes",
    category: "Gasto",
    date: "1/03/2023",
    amount: 5466,
  },
  {
    id: 2,
    description: "Comida",
    category: "Gasto",
    date: "5/012/2023",
    amount: 54,
  },
  {
    id: 3,
    description: "Compras",
    category: "Ganancia",
    date: "10/11/2023",
    amount: 76576,
  },
  {
    id: 4,
    description: "Salidas",
    category: "Gasto",
    date: "9/09/2023",
   amount: 9,
  },
];
const renderOperations = (operations) => {
  for (const operation of operations) {
    $("#tableOperations").innerHTML += `
    <tr>
     <td>${operation.description}</td>
     <td>${operation.category}</td>
     <td>${operation.date}</td>
     <td>${operation.amount}</td>
     <td>
     <button class="text-emerald-500 text-sm font-semibold p-1">editar</button>
     <button class="text-red-700 text-sm font-semibold p-1">eliminar</button>
     </td>
    </tr>
    `;
  }
};
renderOperations(newOperation);

/* EVENTS*/
const initialize = () => {
  $("#categories-nav").addEventListener("click", () => {
    showElement("#category-container");
    hideElement("#main-view");
    hideElement("#reports-div");
    hideElement("#form-new-operation");
  });
  $("#reports-link").addEventListener("click", () => {
    showElement("#reports-div");
    hideElement("#main-view");
    hideElement("#category-container");
    hideElement("#form-new-operation");
  });
  $("#btn-new-operation").addEventListener("click", () => {
    showElement("#form-new-operation");
    hideElement("#main-view");
  });
  $("#form-new-operation").addEventListener("click", (e) => {
    e.preventDefault();
  });
};
window.addEventListener("load", initialize);
//HAMBURGUER MENU

$("#icon-nav").addEventListener("click", () => {
  showColumn();
});

$("#close-nav").addEventListener("click", () => {
  showColumn();
});

const showColumn = () => {
  $("#list-nav").classList.toggle("hidden");
  $("#icon-nav").classList.toggle("hidden");
  $("#list-nav").classList.toggle("flex-col");
  $("#close-nav").classList.toggle("hidden");
};
