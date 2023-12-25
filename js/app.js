/* UTILITIES */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const showElement = (selectors) => {
  for(const selector of selectors){
      $(selector).classList.remove("hidden")
  }
}
const hideElement = (selectors) => {
  for (const selector of selectors){
      $(selector).classList.add("hidden")
  }
}
const randomId = () => self.crypto.randomUUID()

const getData = (key) => JSON.parse(localStorage.getItem(key))
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))

const allOperations = getData("operations") || []

let currentDate = new Date().toJSON().slice(0, 10);

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
      <button class="text-emerald-500 text-sm font-semibold p-1" onclick="showFormEdit('${operation.id}')">editar</button>
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

const showFormEdit = (operationId) => {
  showElement(["#form-new-operation","#btn-edit-operation"])
  hideElement(["#main-view", "#tableOperations","#btn-cancel-operation","#btn-add-operation"])
  const operationSelected = getData("operations").find(operation => operation.id === operationId)
  $("#description-new-operation").value = operationSelected.description
  $("#select-new-category").value = operationSelected.category
  $("#date-input").value = operationSelected.date
  $("#amount-new-operation").value = operationSelected.amount
}
//el boton de EDITAR recarga el navegador, consultar si el evento va en eventos. 

/* EVENTS*/

const initialize = () => {
  setData("operations", allOperations)
  renderOperations(allOperations)
  $("#categories-nav").addEventListener("click", () => {
    showElement(["#category-container"]);
    hideElement(["#main-view","#reports-div","#form-new-operation"]);
  });
  $("#reports-link").addEventListener("click", () => {
    showElement(["#reports-div"]);
    hideElement(["#main-view","#category-container","#form-new-operation"]);
  });
  $("#btn-new-operation").addEventListener("click", () => {
    showElement(["#form-new-operation"]);
    hideElement(["#main-view","#btn-edit-operation"]);
  });
  // $("#form-new-operation").addEventListener("click", (e) => {
  //   e.preventDefault();
  // });
$("#icon-nav").addEventListener("click", () => {
  showElement(["#list-nav","#list-nav","#close-nav"])
  hideElement(["#icon-nav"])
});
$("#close-nav").addEventListener("click", () => {
  hideElement(["#list-nav","#list-nav","#close-nav"])
  showElement(["#icon-nav"])
});
$("#btn-add-operation").addEventListener("click", (e) => {
  e.preventDefault();
  const newOperation = saveOperations()
  const currentData = getData("operations")
  currentData.push(saveOperations())
  setData("operations", currentData)
  hideElement(["#no-results","#form-new-operation"])
  showElement(["#main-view"])
})
$("#btn-edit-operation").addEventListener("click", (e) => {
e.preventDefault()
})
$("#btn-cancel-operation").addEventListener("click", (e) => {
  e.preventDefault()
  })
$("#date-input").value = currentDate
$("#since-date").value = currentDate
};

window.addEventListener("load", initialize);