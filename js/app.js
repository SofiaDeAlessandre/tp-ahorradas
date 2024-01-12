
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
const convertDate = (dateString) => {
  const convertedDate = dateString.replace(/-/g, '');
  return convertedDate;
}

const convertDateFormat = (date) => {
  const time = date.split('-');
  const formattedDate = `${time[2]}/${time[1]}/${time[0]}`;
  return formattedDate;
}

const cleanContainer = (selector) => $(selector).innerHTML = ""

/* RENDERS */

const renderOperations = (operations) => {
  cleanContainer("#tableOperations")
  if(operations.length) {
    showElement(["#tableOperations"])
    hideElement(["#no-results"])
  for (const operation of operations) {
    const categorySelected = getData("categories").find(cat => cat.id === operation.category)
    $("#tableOperations").innerHTML += `
     <tr>
      <td class="text-center">${operation.description}</td>
      <td class="text-center">${categorySelected.categoryName}</td>
      <td class="text-center">${convertDateFormat(operation.date)}</td>
      <td class="text-center font-bold ${ operation.type === "expenses" 
                                                  ? "text-red-500"
                                                  : "text-green-500"}">$${operation.amount}</td>
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
  //hideShowElement(["#tableOperations"])
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

const saveCategoryData = (categoryId = randomId()) => {
  return {
    id: categoryId ? categoryId : randomId(),
    categoryName: $("#input-categories").value
  }
}

const addCategory = () => {
  // const categoryId = $("#select-new-category").options[$("#select-new-category").selectedIndex].getAttribute("data-id")
  hideElement(["#edit-categories-title"])
  const currentCategories = getData("categories")
  const newCategory = saveCategoryData()
  console.log(newCategory)
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

/*FUNCTIONS TO REPORTS SECTION________________________________________________________*/


let categoryMoreBalance = ""
let categoryBalance = 0
let accCategories = {}
const amountByCategories = () => {
  const currentOperations = getData("operations")
  const currentCategories = getData("categories")
  for (const operation of currentOperations){
    const categoryId = operation.category
    const categoriaEncontrada = currentCategories.find(category => category.id === categoryId)
    if (categoriaEncontrada) {
      const categoryName = categoriaEncontrada.categoryName
      if (!accCategories[categoryName]) {
        accCategories[categoryName] = 0
      }
      if(operation.type === "expenses"){
      accCategories[categoryName] += -operation.amount
      }
       else{
      accCategories[categoryName] += operation.amount
      }
    }
  } 
  return accCategories
}
console.log(amountByCategories())

  for (const key in accCategories){
    console.log(accCategories[key])
    if (accCategories[key] > categoryBalance){
      categoryBalance = (accCategories[key])
      categoryMoreBalance = [key]
  }
}
  

//____________________________________________________END OF CATEGORY MORE BALANCE 
let categoryMoreEarnings = ""
let categoryAmount = 0
accCategoriesMoreEarnings = {}
  const earningsByCategories = () => {
    const currentOperations = getData("operations")
    const currentCategories = getData("categories")
    
    for (const operation of currentOperations){
      const categoryId = operation.category
      const categoriaEncontrada = currentCategories.find(category => category.id === categoryId)
      if (categoriaEncontrada) {
        const categoryName = categoriaEncontrada.categoryName
        if (!accCategoriesMoreEarnings[categoryName]) {
          accCategoriesMoreEarnings[categoryName] = 0
        }
        if(operation.type === "earnings"){
        accCategoriesMoreEarnings[categoryName] += operation.amount
        
        }
      }
      
    }
    return accCategoriesMoreEarnings
  }
  
 earningsByCategories()
 
  for (const key in accCategoriesMoreEarnings){
    if (accCategoriesMoreEarnings[key] > categoryAmount){
      categoryAmount = (accCategoriesMoreEarnings[key])
      categoryMoreEarnings = [key]
    } 
  }
//____________________________________________________________________END OF CATEGORIES MORE EARNINGS
let categoryMoreExpenses = ""
let categoryAmountExpenses = 0
accCategoriesMoreExpenses = {}
  const expensesByCategories = () => {
    const currentOperations = getData("operations")
    const currentCategories = getData("categories")
    
    for (const operation of currentOperations){
      const categoryId = operation.category
      const categoriaEncontrada = currentCategories.find(category => category.id === categoryId)
      if (categoriaEncontrada) {
        const categoryName = categoriaEncontrada.categoryName
        if (!accCategoriesMoreExpenses[categoryName]) {
          accCategoriesMoreExpenses[categoryName] = 0
        }
        if(operation.type === "expenses"){
        accCategoriesMoreExpenses[categoryName] += operation.amount
        }
      }
    }
    for (const key in accCategoriesMoreExpenses){
      if (accCategoriesMoreExpenses[key] > categoryAmountExpenses){
        categoryAmountExpenses = (accCategoriesMoreExpenses[key])
        categoryMoreExpenses = [key]
      }
    }
    return accCategoriesMoreExpenses
  }
  
 expensesByCategories()

 
//_________________________________________________________________END OF CATOGORY MORE EXPENSES

let monthMoreEarning = {}
const earningMonth = () => {
  const operaciones = getData("operations")
for (const operacion of operaciones) {
  let currentNewDate = new Date(operacion.date)
   const dateMonth = currentNewDate.getMonth()+1 + "/" + currentNewDate.getFullYear()
   //console.log(fechaMes)
   if (!monthMoreEarning[dateMonth]) {
    monthMoreEarning[dateMonth] = 0
  }
   if (operacion.type === "earnings") {
    monthMoreEarning[dateMonth] += operacion.amount
   }
}
return monthMoreEarning
}
earningMonth()



let monthEarning = ""
 let amountMonthMoreEarning = 0
  for (const key in monthMoreEarning){
    if (monthMoreEarning[key] > amountMonthMoreEarning){
      amountMonthMoreEarning = monthMoreEarning[key]
      monthEarning = [key]
    } 
  }
  
//__________________________________________________________________________
 
let monthMoreExpense = {}
const expenseMonth = () => {
  const operaciones = getData("operations")
for (const operacion of operaciones) {
  let currentNewDate = new Date(operacion.date)
   const dateMonth = currentNewDate.getMonth()+1 + "/" + currentNewDate.getFullYear()
   if (!monthMoreExpense[dateMonth]) {
    monthMoreExpense[dateMonth] = 0
  }
   if (operacion.type === "expenses") {
    monthMoreExpense[dateMonth] += operacion.amount
   }
}
return monthMoreExpense
}
expenseMonth()



let monthExpense= ""
 let amountMonthMoreExpense = 0
  for (const key in monthMoreEarning){
    if (monthMoreExpense[key] > amountMonthMoreExpense){
      amountMonthMoreExpense = monthMoreExpense[key]
      monthExpense = [key]
    } 
  }
  //console.log(amountMonthMoreExpense)
//____________________________________________________________________
const totalsByMonth = () => {
  const currenData = getData("operations")
  const totalByMonth = {}
  for (const { date, amount, type } of currenData) {
      const splitDate = date.split("-")
      const formatDate = splitDate[1] + "/" + splitDate[0]
      if (!totalByMonth[formatDate]) {
          totalByMonth[formatDate] = {
              earning: 0,
              spent: 0,
              balance: 0
          }
      }
      if (type === "earnings") {
          totalByMonth[formatDate].earning += amount
      } else {
          totalByMonth[formatDate].spent -= amount
      }
      totalByMonth[formatDate].balance = totalByMonth[formatDate].earning + totalByMonth[formatDate].spent
   }
  return totalByMonth
 }

totalsByMonth()

const renderTotalsByMonth = (obTtotal) => {
  const currenData = getData ("operations")
for (const key in obTtotal) {
  $("#tbody-table-total-month-reports").innerHTML += `
<tr>
<td>${key}</td>
<td>${obTtotal[key].earning}</td>
<td>${obTtotal[key].spent}</td>
<td>${obTtotal[key].balance}</td>
</tr>
`
}
}
renderTotalsByMonth(totalsByMonth())
//_______________________________________________________TOTALS BY CATEGORIES
const totalsByCategories = () => {
  const categoriesName = {}
  const currentOperations = getData("operations")
  const currentCategories = getData("categories")
  for (const operation of currentOperations){
    const categoryId = operation.category
    const categoriaEncontrada = currentCategories.find(category => category.id === categoryId)
    if (categoriaEncontrada) {
      const categoryName = categoriaEncontrada.categoryName
      if (!categoriesName[categoryName]) {
        categoriesName[categoryName] = {
          earning: 0,
          spent: 0,
          balance: 0
        }
      }
      if(operation.type === "earnings"){
        categoriesName[categoryName].earning += operation.amount 
        }
        else{
          categoriesName[categoryName].spent += -operation.amount
        }
        categoriesName[categoryName].balance = categoriesName[categoryName].earning + categoriesName[categoryName].spent
    }

}
return categoriesName
}
console.log(totalsByCategories())

const renderTotalByCastegories = (obTotalCategories) =>{
const currenDataOperations = getData("operations")
for (const key in obTotalCategories){
$("#tbody-table-total-categories").innerHTML += `
<tr>
<td>${key}</td>
<td>${obTotalCategories[key].earning}</td>
<td>${obTotalCategories[key].spent}</td>
<td>${obTotalCategories[key].balance}</td>
</tr>
`
}
}
renderTotalByCastegories(totalsByCategories())
//________________________________________________

const renderCategoriesReports = () => {
  $("#category-more-earnings").innerText = `${categoryMoreEarnings}` 
  $("#amount-category-more-earnings").innerText = `$${categoryAmount}`
  $("#category-more-expenses").innerText = `${categoryMoreExpenses}`
  $("#amount-category-more-expenses").innerText = `-$${categoryAmountExpenses}`
  $("#category-more-balance").innerText = `${categoryMoreBalance}`
  $("#amount-category-more-balance").innerText = `$${categoryBalance}`
  $("#month-more-earning").innerText = `${monthEarning}`
  $("#amount-month-more-earning").innerText = `$${amountMonthMoreEarning}`
  $("#month-more-expense").innerText = `${monthExpense}`
  $("#amount-month-more-expense").innerText = `-$${amountMonthMoreExpense}`
}
 renderCategoriesReports()
//___________________________________________________________________________________

// const reportsFunctions = () => {
//   const currenData = getData("operations")
//   let earningOperation = currenData.some((operation) => operation.type === "earnings")
//   let expenseOperation = currenData.some((operation) => operation.type === "expenses")
//   if(earningOperation && expenseOperation){
//     hideElement(["#reports-div"])
//     amountByCategories()
//     earningsByCategories()
//     expensesByCategories()
//     earningMonth()
//     expenseMonth()
//   }else{
//     showElement(["#reports-div"])
//     hideElement(["#current-reports"])
//   }
// }
// reportsFunctions()



//________________________________________________________________________

const renderBalance = () => {
  if(getData("categories")){
  const funcionAmount  = amountAndEarning()
  $("#earnings-container").innerText = `$${funcionAmount.earnings}`
  $("#expenses-container").innerText = `-$${funcionAmount.expenses}`
  $("#total-container").innerText = `$${funcionAmount.total}`;
  $("#total-container").classList.add(funcionAmount.total >= 0 ? "text-green-500" : "text-red-500")
}
}

renderBalance()

// FILTERS 

const filterType = (filter, operations) => {
  if(filter === "all"){
    return operations
  } else {
   operations = operations.filter(operation => operation.type === filter)
  }
  return operations
}

const filterCategory = (filter, operations) => {
  if(filter === "all") {
    return operations
  } else {
  operations = operations.filter(operation => operation.category === filter)
}
return operations
}

const filterDate = (filter, operations) => { 
  operations = operations.filter(operation => convertDate(operation.date) >= filter)
  return operations
}

  const filterOrder = (filter, operations) => {
  switch (filter) {
    case 'more-recent':
      operations = operations.sort((a, b) => convertDate(b.date) - convertDate(a.date))
      break
    case 'less-recent':
      operations = operations.sort((a, b) => convertDate(a.date) - convertDate(b.date))
      break
    case 'higher-amount':
      operations = operations.sort((a, b) => b.amount - a.amount)
      break
      case 'lower-amount':
        operations = operations.sort((a, b) => a.amount - b.amount)
        break
        case 'from-a':
          operations = operations.sort((a, b) => a.description.localeCompare(b.description))
          break
          case 'from-z':
            operations = operations.sort((a, b) => b.description.localeCompare(a.description))
      break
  }
  return operations
  }


  const filterOperation = () => {
    let filteredOperations = [...allOperations]
    filteredOperations = filterType($("#select-type").value, filteredOperations)
    filteredOperations = filterCategory($("#categories-select").value, filteredOperations)
    filteredOperations = filterDate(convertDate($("#since-date").value), filteredOperations)
    filteredOperations = filterOrder($("#filter-order").value, filteredOperations)
    return filteredOperations
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
    hideElement(["#main-view","#reports-div","#form-new-operation"])
  })
 $("#reports-link").addEventListener("click", () => {
  const currenData = getData("operations")
  let earningOperation = currenData.some((operation) => operation.type === "earnings")
  let expenseOperation = currenData.some((operation) => operation.type === "expenses")
  if(earningOperation && expenseOperation){
    showElement(["#current-reports"]);
    hideElement(["#reports-div","#main-view","#category-container","#form-new-operation"]);
  } else{
    showElement(["#reports-div"])
    hideElement(["#main-view","#category-container","#form-new-operation"]);
  }
  })
  $("#btn-new-operation").addEventListener("click", () => {
    showElement(["#form-new-operation"]);
    hideElement(["#main-view","#btn-edit-operation"]);
  })

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

// FILTERSSSSSSSSSSS

$("#select-type").addEventListener("change", () => {
  renderOperations(filterOperation())
})

$("#categories-select").addEventListener("change", () => {
  renderOperations(filterOperation())
})

$("#since-date").addEventListener("change", () => {
  renderOperations(filterOperation())
})

$("#filter-order").addEventListener("change", () => {
  renderOperations(filterOperation())
})


}; // END OF INITIALIZEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE

window.addEventListener("load", initialize);



