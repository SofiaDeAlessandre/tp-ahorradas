/* UTILITIES */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const showElement = (selector) => $(selector).classList.remove("hidden");
const hideElement = (selector) => $(selector).classList.add("hidden");

const randomId = () => self.crypto.randomUUID()

const getData = (key) => JSON.parse(localStorage.getItem(key))
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))

const allOperations = getData("operations") || []

/* RENDERS */

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

const saveOperations = () => {
    return {
        id: randomId(),
        description: $("#description-new-operation").value ,
        category: $("#select-new-category").value ,
        type: $("#select-type-new-operation").value ,
        date: $("#date-input").value ,
        amount: $("#amount-new-operation"). value ,
    }
}

/* EVENTS*/

const initialize = () => {
  setData("operations", allOperations)
  renderOperations(allOperations)
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
    hideElement("#btn-cancel-operation");
    hideElement("#btn-edit-operation")
  });
  // $("#form-new-operation").addEventListener("click", (e) => {
  //   e.preventDefault();
  // });
$("#icon-nav").addEventListener("click", () => {
  showElement("#list-nav")
  hideElement("#icon-nav")
  showElement("#list-nav")
  showElement("#close-nav")
});
$("#close-nav").addEventListener("click", () => {
  hideElement("#list-nav")
  showElement("#icon-nav")
  hideElement("#list-nav")
  hideElement("#close-nav")
});
$("#btn-add-operation").addEventListener("click", (e) => {
  e.preventDefault();
  const newOperation = saveOperations()
  const currentData = getData("operations")
  currentData.push(saveOperations())
  setData("operations", currentData)
  hideElement("#no-results")
  hideElement("#form-new-operation")
  showElement("#main-view")
})
};

window.addEventListener("load", initialize);