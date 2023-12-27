
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
const hideShowElement = (selectors) => {
  for (const selector of selectors){
    $(selector).classList.toggle("hidden")
  }
}

const randomId = () => self.crypto.randomUUID()


const defaultCategories = [
  {
      id: randomId(),
      categoryName: "Comida"
  },
  {
      id: randomId(),
      categoryName: "Servicios"
  },
  {
      id: randomId(),
      categoryName: "Salidas"
  },
  {
      id: randomId(),
      categoryName: "Educación"
  },
  {
    id: randomId(),
    categoryName: "Transporte"
},
{
    id: randomId(),
    categoryName: "Trabajo"
}

]

const getData = (key) => JSON.parse(localStorage.getItem(key))
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))

const allOperations = getData("operations") || []
const allCategories = getData("categories") || defaultCategories

let currentDate = new Date().toJSON().slice(0, 10);

const cleanContainer = selector => selector.innerHTML = "";


/* RENDERS */

const renderOperations = (operations) => {
  cleanContainer("#tableOperations")
  for (const operation of operations) {
    const categorySelected = getData("categories").find(cat => cat.id === operation.category)
    console.log(operation.category)
    console.log(categorySelected)
    $("#tableOperations").innerHTML += `
     <tr>
      <td>${operation.description}</td>
      <td>${categorySelected.categoryName}</td>
      <td>${operation.date}</td>
      <td>${operation.amount}</td>
      <td>
      <button class="text-emerald-500 text-sm font-semibold p-1" onclick="showFormEdit('${operation.id}')">editar</button>
      <button class="text-red-700 text-sm font-semibold p-1" onclick="deleteOperations('${operation.id}')">eliminar</button>
      </td>
     </tr>
    `;
  }
};


const renderCategoriesTable = (categories) => {
  cleanContainer("#category-container")
  for(const category of categories){
      $("#category-container").innerHTML += `
      <div> 
      <span>
          <div class="columns-4xl">${category.categoryName}
          <button class="text-emerald-500 text-sm font-semibold p-6" onclick="showFormCategory('${category.id}')"> editar </button>
          <button class="text-red-700 text-sm font-semibold p-6" onclick="deleteCategories ('${category.id}')"> eliminar </button>
          </span>
              </div>
              </div>
              
      `
  }

}

const renderCategoriesOptions = (newCategories) => {
  // cleanContainer("#select-new-category")
  for(const category of newCategories){
      $("#select-new-category").innerHTML += `
      <option value="${category.id}" data-id="${category.id}">${category.categoryName}</option> 

      `
  }
      for(const category of newCategories){
        $("#categories-select").innerHTML += `
        <option value="${category.id}" data-id="${category.id}">${category.categoryName}</option> 
  
        `
  }
}

const saveOperations = () => {
    const categoryId = $("#select-new-category").options[$("#select-new-category").selectedIndex].getAttribute("data-id")
    return {
        id: randomId(),
        description: $("#description-new-operation").value ,
        category: categoryId,
        type: $("#select-type-new-operation").value ,
        date: $("#date-input").value ,
        amount: $("#amount-new-operation").valueAsNumber , //NO TOMA ASNUMBER
    }
}

const saveCategoryData = () => {
  return {
    id: randomId(),
    categoryName: $("#categories").value
  };
}

const addCategory = () => {
  const currentCategories = getData("categories")
  const newCategory = saveCategoryData()
  currentCategories.push(newCategory)
  setData("categories", currentCategories)
}

const showFormEdit = (operationId) => {
  showElement(["#form-new-operation","#btn-edit-operation"])
  hideElement(["#main-view", "#tableOperations","#btn-add-operation"])
  $("#btn-edit-operation").setAttribute("data-id", operationId)
  const operationSelected = getData("operations").find(operation => operation.id === operationId)
  $("#description-new-operation").value = operationSelected.description
  $("#select-new-category").value = operationSelected.category
  $("#date-input").value = operationSelected.date
  $("#amount-new-operation").value = operationSelected.amount
  $("#select-type-new-operation").value = operationSelected.type
}

const showFormCategory = (categoryId) => {
  showElement(["#categories-edit"])
  hideElement(["#main-view", "#tableOperations","#btn-add-operation","#form-new-operation","#categories-section"])
  $("#btn-edit-category").setAttribute("data-id", categoryId)
  const categorySelected = getData("categories").find(cat => cat.id === categoryId)
  $("#select-new-category").value = categorySelected.categoryId
}

//el boton de EDITAR recarga el navegador, consultar si el evento va en eventos. 

const deleteOperations = (operationId) => {
  const currentData = getData("operations").filter(op => op.id !== operationId)
  setData("operations", currentData)
  window.location.reload()
}

const deleteCategories = (categoryId) => {
  const currentData = getData("categories").filter(cat => cat.id !== categoryId)
  setData("categories", currentData)
}


/* EVENTS*/

const initialize = () => {
  setData("operations", allOperations)
  setData("categories", allCategories)
  renderOperations(allOperations)
  renderCategoriesTable(allCategories)
  renderCategoriesOptions(allCategories)

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
const operationId = $("#btn-edit-operation").getAttribute("data-id")
const currentData = getData("operations").map(operation => {
  if (operation.id === operationId) {
    return saveOperations()
  }
  return operation
})
setData("operations", currentData)
window.location.reload()
})

$("#btn-cancel-operation").addEventListener("click", (e) => {
  e.preventDefault()
  window.location.reload() //CONSULTAR POR EL EVENTO PARA QUE EL BTN CANCELAR RECARGUE EL NAVEGADOR
  })

$("#date-input").value = currentDate
$("#since-date").value = currentDate

$("#btn-hide-filters").addEventListener("click", () => {
  hideShowElement(["#filter-types","#category-filters","#since-filters","#order-filters"])
})
};

$("#categories-nav").addEventListener("click", () => {
  showElement(["#category-container"]);
  hideElement(["#main-view","#reports-div","#form-new-operation"]);
});
$("#btn-add-category").addEventListener("click", () => {
  e.preventDefault()
  addCategory()
  const currentCategories = getData("categories")
  renderCategoriesOptions(currentCategories)
  renderCategoriesTable(currentCategories)
})

window.addEventListener("load", initialize);
