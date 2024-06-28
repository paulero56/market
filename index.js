import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://project-v2-92d34-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const undoButtonEl = document.getElementById("undo-button")  // Add an undo button in your HTML
const shoppingListEl = document.getElementById("shopping-list")

let lastDeletedItem = null  // Variable to store the last deleted item

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "Lista Vacia"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        // Store the last deleted item
        lastDeletedItem = { id: itemID, value: itemValue }
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}

// Add event listener for the undo button
undoButtonEl.addEventListener("click", function() {
    if (lastDeletedItem) {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${lastDeletedItem.id}`)
        
        set(exactLocationOfItemInDB, lastDeletedItem.value)
        
        // Clear the lastDeletedItem variable after undoing
        lastDeletedItem = null
    }
})
