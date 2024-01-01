
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

let filteredOperation = [] 
//let filterCategory = []

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

const cleanContainer = (selector) => $(selector).innerHTML = ""

/* RENDERS */

const renderOperations = (operations) => {
  // cleanContainer("#tableOperations")
  if(operations.length) {
    hideElement(["#no-results"])
  for (const operation of operations) {
    const categorySelected = getData("categories").find(cat => cat.id === operation.category)
    $("#tableOperations").innerHTML += `
     <tr>
      <td class="text-center">${operation.description}</td>
      <td class="text-center">${categorySelected.categoryName}</td>
      <td class="text-center">${operation.date}</td>
      <td class="text-center">$${operation.amount}</td>
      <td class="text-center">
      <button class="text-emerald-500 text-sm font-semibold p-1" onclick="showFormEdit('${operation.id}')">editar</button>
      <button class="text-red-700 text-sm font-semibold p-1" onclick="deleteOperations('${operation.id}')">eliminar</button>
      </td>
     </tr>
    `;
  }
} else {
  showElement(["#no-results"])
  hideElement(["#tableOperations"])
}
};


const renderCategoriesTable = (categories) => {
  cleanContainer("#table-tbody")
  for(const category of categories){
      $("#table-tbody").innerHTML += `
      <tr>
          <td class="w-3/4">${category.categoryName}
          <button class="text-emerald-500 text-sm font-semibold p-6" onclick="showFormCategory('${category.id}')"> editar </button>
          <button class="text-red-700 text-sm font-semibold p-6" onclick="deleteAction('${category.id}')"> eliminar </button>
      </tr>  
      `
  }
}

const renderCategoriesOptions = (categoriesArray) => {
  for(const category of categoriesArray){
    if(category != "Todas"){
      $("#select-new-category").innerHTML += `
      <option value="${category.id}" data-id="${category.id}">${category.categoryName}</option> 

     `
        $("#categories-select").innerHTML += `
        <option value="${category.id}" data-id="${category.id}">${category.categoryName}</option> 

      `     
    }
  }
  }


const saveOperations = (operationId) => {
    const categoryId = $("#select-new-category").options[$("#select-new-category").selectedIndex].getAttribute("data-id")
    return {
        id: operationId ? operationId : randomId(),
        description: $("#description-new-operation").value ,
        category: categoryId,
        type: $("#select-type-new-operation").value ,
        date: $("#date-input").value ,
        amount: $("#amount-new-operation").valueAsNumber ,
    }
} 

const saveCategoryData = (categoryId) => {
  return {
    id: categoryId ? categoryId : randomId(),
    categoryName: $("#input-categories").value
  }
}

const addCategory = () => {
  const categoryId = $("#select-new-category").options[$("#select-new-category").selectedIndex].getAttribute("data-id")
  hideElement(["#edit-categories-title"])
  const currentCategories = getData("categories")
  const newCategory = saveCategoryData(categoryId)
  currentCategories.push(newCategory)
  setData("categories", currentCategories)
  renderCategoriesTable(currentCategories)
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
  showElement(["#edit-categories-title", "#btn-cancel-category", "#btn-edit-category"])
  hideElement(["#main-view", "#tableOperations","#btn-add-category","#form-new-operation","#add-categories-title","#table-tbody"])
  $("#btn-edit-category").setAttribute("data-id", categoryId)
  const categorySelected = getData("categories").find(cat => cat.id === categoryId)
  $("#input-categories").value = categorySelected.categoryName
}

// el boton de EDITAR recarga el navegador, consultar si el evento va en eventos. 

const deleteOperations = (operationId) => {
  const currentData = getData("operations").filter(op => op.id !== operationId)
  setData("operations", currentData)
  window.location.reload()
}

const deleteCategories = (categoryId) => {
  const currentCategories = getData("categories").filter(category => category.id !== categoryId)
  setData("categories", currentCategories)
  return currentCategories

}

const deleteAction = (categoryId) => {
  renderCategoriesTable(deleteCategories(categoryId))
  const currentData = getData("operations").filter(operation => operation.category != categoryId)
  setData("operations", currentData)
}

const amountAndEarning = () => {
  if (getData("categories")){
  const currentDataOperations = getData("operations")
  let earnings = 0
  let expenses = 0
  let total = 0
  for (const operation of currentDataOperations) {
    if (operation.type === "expenses") {
      expenses += operation.amount
        } else {
          earnings += operation.amount
        } 
  }
  total = earnings - expenses

  return {
    earnings: earnings,
    expenses: expenses ,
    total: total
  }
}
}
amountAndEarning()

const renderBalance = () => {
  if(getData("categories")){
  const funcionAmount  = amountAndEarning()
  $("#earnings-container").innerText = `$${funcionAmount.earnings}`
  $("#expenses-container").innerText = `-$${funcionAmount.expenses}`
  $("#total-container").innerText = `$${funcionAmount.total}`
}
}
renderBalance()
/* EVENTS*/

const initialize = () => {
  setData("operations", allOperations)
  setData("categories", allCategories)
  renderOperations(allOperations)
  renderCategoriesTable(allCategories)
  renderCategoriesOptions(allCategories)
  $("#categories-nav").addEventListener("click", () => {
    showElement(["#category-container"]);
    hideElement(["#main-view","#reports-div","#form-new-operation"])
  })
 $("#reports-link").addEventListener("click", () => {
    showElement(["#reports-div"]);
    hideElement(["#main-view","#category-container","#form-new-operation"]);
  })
  $("#btn-new-operation").addEventListener("click", () => {
    showElement(["#form-new-operation"]);
    hideElement(["#main-view","#btn-edit-operation"]);
  })
  // $("#form-new-operation").addEventListener("click", (e) => {
  //   e.preventDefault();
  // });

$("#icon-nav").addEventListener("click", () => {
  showElement(["#list-nav","#list-nav","#close-nav"])
  hideElement(["#icon-nav"])
})

$("#close-nav").addEventListener("click", () => {
  hideElement(["#list-nav","#list-nav","#close-nav"])
  showElement(["#icon-nav"])
})

$("#btn-add-operation").addEventListener("click", (e) => {
  e.preventDefault();
  const newOperation = saveOperations()
  const currentData = getData("operations")
  currentData.push(saveOperations())
  setData("operations", currentData)
  hideElement(["#form-new-operation"])
  window.location.reload() 
})

$("#btn-edit-operation").addEventListener("click", (e) => {
e.preventDefault()
const operationId = $("#btn-edit-operation").getAttribute("data-id")
const currentData = getData("operations").map(operation => {
  if (operation.id === operationId) {
    return saveOperations(operationId)
  }
  return operation
})
setData("operations", currentData)
window.location.reload()
})

$("#btn-cancel-operation").addEventListener("click", (e) => {
  e.preventDefault()
  window.location.reload() 
  })

  $("#btn-cancel-category").addEventListener("click", (e) => {
    e.preventDefault()
    hideElement(["#edit-categories-title", "#btn-cancel-category", "#btn-edit-category"])
    showElement(["#btn-add-category","#add-categories-title","#table-tbody"])
  })

  $("#btn-edit-category").addEventListener("click", (e) => {
    e.preventDefault()
    const categoryId = $("#btn-edit-category").getAttribute("data-id")
    const currentData = getData("categories").map(category => {
      if (category.id === categoryId) {
        return saveCategoryData(categoryId)
      }
      return category
    })
    setData("categories", currentData)
    renderCategoriesTable(currentData)
    hideElement(["#edit-categories-title", "#btn-cancel-category", "#btn-edit-category"])
    showElement(["#btn-add-category","#add-categories-title","#table-tbody"])
    })
  
$("#date-input").value = currentDate
$("#since-date").value = currentDate

$("#btn-add-category").addEventListener("click", (e) => {
  e.preventDefault()
  addCategory()
})

$("#btn-hide-filters").addEventListener("click", () => {
  hideElement(["#filter-types","#category-filters","#since-filters","#order-filters","#btn-hide-filters"])
  showElement(["#btn-show-filters"])
})
$("#btn-show-filters").addEventListener("click", () => {
  showElement(["#filter-types","#category-filters","#since-filters","#order-filters","#btn-hide-filters"])
  hideElement(["#btn-show-filters"])
})

$("#categories-nav").addEventListener("click", () => {
  showElement(["#category-container"]);
  hideElement(["#main-view","#reports-div","#form-new-operation"]);
})

$("#select-type").addEventListener("input", (e) => {
  const typeSelected = e.target.value
  const currentData = getData("operations")
  if(typeSelected!=="all"){
  
  const filteredOperations = currentData.filter(operation => operation.type == typeSelected)
  //console.log(filteredOperations)
  filteredOperation.push(filteredOperations)
  cleanContainer("#tableOperations")
   renderOperations(filteredOperations)
  }
  else {
    cleanContainer("#tableOperations")
    renderOperations(currentData)
  }
})

// $("#categories-select").addEventListener("input", (e) => {
//   const categoriesSelected = e.target.value
//   const currentData = getData("categories")
//    for (const categories of currentData){
//     const filteredCategories = currentData.filter(category => category.id === categoriesSelected)
//     filterCategory.push(filteredCategories)
    
//      cleanContainer("#tableOperations")
//      renderOperations(filterCategory)
//   } 
//   console.log(categoriesSelected)
//   //renderOperations(filterCategory)
//   //console.log(filterCategory)
  
//  })

}; // END OF INITIALIZEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE

window.addEventListener("load", initialize);

