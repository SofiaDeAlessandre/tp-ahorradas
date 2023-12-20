const $ = selector => document.querySelector(selector)
const $$ = selector => document.querySelectorAll(selector)

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

