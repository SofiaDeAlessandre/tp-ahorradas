const $ = selector => document.querySelector(selector)
const $$ = selector => document.querySelectorAll(selector)

const showElement = (selector) => $(selector).classList.remove("hidden")
const hideElement = (selector) => $(selector).classList.add("hidden")

const initialize = () => {
    $("#categories-nav").addEventListener("click", () => {
        showElement("#category-container")
        hideElement("#main-view")
        hideElement("#reports-div")
        hideElement("#form-new-operation")
    })
    $("#reports-link").addEventListener("click", () => {
        showElement("#reports-div")
        hideElement("#main-view")
        hideElement("#category-container")
        hideElement("#form-new-operation")
    })
    $("#btn-new-operation").addEventListener("click", () => {
        showElement("#form-new-operation")
        hideElement("#main-view")
    })
    $("#form-new-operation").addEventListener("click", (e) => {
        e.preventDefault()
    })
}
window.addEventListener("load", initialize)
//HAMBURGUER MENU

$("#icon-nav").addEventListener("click", () => {
   showColumn()
    })

$("#close-nav").addEventListener("click", () => {
       showColumn()
     })

    
const showColumn = () => {
    $("#list-nav").classList.toggle("hidden")
    $("#icon-nav").classList.toggle("hidden")
    $("#list-nav").classList.toggle("flex-col")
    $("#close-nav").classList.toggle("hidden")
}

