import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Firebase app configuration
const appSettings = {
    databaseURL: "https://project-v2-92d34-default-rtdb.firebaseio.com/"
}

// Initialize Firebase app
const app = initializeApp(appSettings)
const database = getDatabase(app)

const shoppingListInDB = ref(database, "shoppingList")

// DOM elements
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const undoButtonEl = document.getElementById("undo-button")  // Add an undo button in your HTML
const shoppingListEl = document.getElementById("shopping-list")

let lastDeletedItem = null

// Add new item to Firebase when the add button is clicked
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if (inputValue.trim() !== "") {
        let uniqueID = uuid.v4()
        set(ref(database, `shoppingList/${uniqueID}`), { id: uniqueID, value: inputValue })
        clearInputFieldEl()
    }
})

// Listen for changes in the Firebase database for this device
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearShoppingListEl()
        itemsArray.forEach(currentItem => appendItemToShoppingListEl(currentItem))
    } else {
        shoppingListEl.innerHTML = "Lista Vacia"
    }
})

// Clear the shopping list element
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Clear the input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Append an item to the shopping list element
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1].value
    
    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        lastDeletedItem = { id: itemID, value: itemValue }
        remove(ref(database, `shoppingList/${itemID}`))
    })
    
    shoppingListEl.append(newEl)
}

// Add event listener for the undo button
undoButtonEl.addEventListener("click", function() {
    if (lastDeletedItem) {
        set(ref(database, `shoppingList/${lastDeletedItem.id}`), lastDeletedItem)
        
        // Clear the lastDeletedItem variable after undoing
        lastDeletedItem = null
    }
})
