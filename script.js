// Practicing Consol Outputs
console.log("Japan Travel Planner Engine Initilized");

// Also counting # of location cards based on div id
let mySavedSpots = document.querySelectorAll('.locations');

let savedData = localStorage.getItem('myJapanTrip');
let travelLocations;

if (savedData){
    travelLocations = JSON.parse(savedData);
} else {
    // If it's null (first time user), load the default hardcoded data
    travelLocations = [
        { name: "Shibuya Station", category: "Anime Landmark (JJK)", notes: "Need to find the specific exit from the Shibuya Incident arc.", visited: false },
        { name: "T's Tantan (Tokyo Station)", category: "Ovo-Vegetarian", notes: "Famous vegan ramen spot inside Keiyo Street.", visited: false },
        { name: "Daikoku Futo PA", category: "Motorcycle & Car Scene", notes: "Legendary car meet spot.", visited: false }
    ];
}

// DOM REFERENCES: Grabbing our main HTML anchors
let container = document.getElementById('locations-container');
let addButton = document.getElementById('add-btn');

// THE RENDER LOOP: Wipes the screen and redraws based on State
function renderLocations() {
    
    // Save current state to hard drive
    localStorage.setItem('myJapanTrip', JSON.stringify(travelLocations));

    // Create an empty string to hold all our generated HTML
    let allHTML = "";

    // LOOP 1: Build the HTML String
    for (let i = 0; i < travelLocations.length; i++) {
        let spot = travelLocations[i]; 

        // Conditional Logic: Check state to determine colors and text
        let cardColor = "white";
        let buttonText = "Mark as Visited";

        if (spot.visited === true) {
            cardColor = "#d4edda"; // Light green
            buttonText = "Visited!";
        }

        // Build the HTML template for this specific card
        let cardHTML = `
            <div class="locations" id="card-${i}" style="background-color: ${cardColor};">
                <h3>${spot.name}</h3>
                <p><strong>Category:</strong> ${spot.category}</p>
                <p><strong>Notes:</strong> ${spot.notes}</p>
                <button id="btn-${i}">${buttonText}</button>
                <button id="delete-btn-${i}" style="background-color: #ff4d4d; color: white; margin-left: 10px;">Delete</button>
            </div>
        `;

        allHTML += cardHTML;
    }

    // Push the massive string to the screen all at once
    container.innerHTML = allHTML;

    // LOOP 2: Attach the Event Listeners to the new buttons
    for (let i = 0; i < travelLocations.length; i++) {
        
        // Visited Button
        let button = document.getElementById(`btn-${i}`);
        
        button.addEventListener('click', function() {
            // Flip the boolean state in our array
            travelLocations[i].visited = !travelLocations[i].visited;
            // Command the UI engine to repaint the screen
            renderLocations();
        });

        // Delete Button
        let deleteButton = document.getElementById(`delete-btn-${i}`);
        deleteButton.addEventListener('click', function(){
            // Remove 1 element at i
            travelLocations.splice(i,1);
            renderLocations();
        })
    }
}

// INITIALIZATION: Call it once so the page draws the initial cards on load
renderLocations();

// USER INPUT: Listen for new locations being added
addButton.addEventListener('click', function() {
    
    // Grab the raw text the user typed
    let nameInput = document.getElementById('new-name').value;
    let categoryInput = document.getElementById('new-category').value;
    let notesInput = document.getElementById('new-notes').value;

    // GUARD CLAUSE(s)
    if (nameInput.trim() === "") {
        alert("Please enter a location name before saving!");
        return; // This immediately stops the function from running!
    }

    if (categoryInput.trim() === "") {
        alert("Please enter a category type before saving!");
        return; // This immediately stops the function from running!
    }

    // Build a new object
    let newLocation = {
        name: nameInput,
        category: categoryInput,
        notes: notesInput,
        visited: false
    };

    // Push to the array (like vector.push_back())
    travelLocations.push(newLocation);

    // Command the UI engine to repaint the screen to show the new card
    renderLocations();
    
    // Clear the input boxes so they are empty for the next entry
    document.getElementById('new-name').value = "";
    document.getElementById('new-category').value = "";
    document.getElementById('new-notes').value = "";
});