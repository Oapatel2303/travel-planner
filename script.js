// practicing console outputs
console.log("travel planner master engine initialized");

// ==========================================
// ENGINE 0: MASTER DATABASE & ROUTER
// ==========================================

// this variable tracks which folder is open right now. null means we are in the hallway (dashboard)
let activeTripId = null; 

// looking for the master filing cabinet on the hard drive
let savedMaster = localStorage.getItem('myMasterTrips');
let masterTripsArray;

if (savedMaster) {
    masterTripsArray = JSON.parse(savedMaster);
} else {
    // hardcoding the test dummies (japan and france) so we can prove the filter works
    masterTripsArray = [
        {
            id: "trip_japan",
            name: "japan 2026",
            dates: "oct 2026",
            categories: [
                { name: "vegetarian spots", checked: false },
                { name: "anime landmarks (one piece, jjk)", checked: false },
                { name: "motorcycle & car scene spots", checked: false }
            ],
            locations: [
                { name: "shibuya station", category: "anime landmark (jjk)", notes: "need to find the specific exit from the shibuya incident arc.", visited: false },
                { name: "t's tantan (tokyo station)", category: "vegetarian", notes: "famous vegan ramen spot inside keiyo street.", visited: false },
                { name: "daikoku futo pa", category: "motorcycle & car scene", notes: "legendary car meet spot.", visited: false }
            ]
        },
        {
            id: "trip_france",
            name: "france food tour",
            dates: "sept 2027",
            categories: [
                { name: "bistro classics", checked: false }
            ],
            locations: [
                { name: "le procope", category: "bistro classics", notes: "historic restaurant in paris. trying the coq au vin.", visited: false }
            ]
        }
    ];
}

// grab the html anchor points for routing
let pageDashboard = document.getElementById('page-dashboard');
let pagePlanner = document.getElementById('page-planner');
let tripListContainer = document.getElementById('trip-list-container');
let btnBack = document.getElementById('btn-back');
let currentTripTitle = document.getElementById('current-trip-title');

// back button logic
btnBack.addEventListener('click', function() {
    pagePlanner.style.display = 'none'; // hide planner
    pageDashboard.style.display = 'block'; // show dashboard
    activeTripId = null; // clear the active state so nothing accidentally saves to the wrong folder
});

// draws the trip cards on pg 2
function renderDashboard() {
    // save the whole cabinet to the hard drive
    localStorage.setItem('myMasterTrips', JSON.stringify(masterTripsArray));
    
    let dashHTML = "";
    for (let i = 0; i < masterTripsArray.length; i++) {
        let trip = masterTripsArray[i];
        
        // modifying css .locations class
        dashHTML += `
            <div class="locations">
                <h3 style="margin-top: 0;">${trip.name}</h3>
                <p><strong>dates:</strong> ${trip.dates}</p>
                <button onclick="openTrip('${trip.id}')" style="background-color: #2196F3; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">open planner</button>
                <button onclick="deleteTrip('${trip.id}')" style="background-color: #ff4d4d; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-left: 10px;">delete</button>
            </div>
        `;
    }
    tripListContainer.innerHTML = dashHTML;
}

// the context switch logic (the magic)
// we use window. so the inline html onclick button can see it
window.openTrip = function(tripId) {
    activeTripId = tripId; // lock in the current trip id
    
    // find the matching folder in the master array using .find()
    let currentTrip = masterTripsArray.find(t => t.id === activeTripId);
    
    // change the h2 title on pg 3 dynamically
    currentTripTitle.innerText = currentTrip.name + " itinerary";

    // switch the theater sets
    pageDashboard.style.display = 'none';
    pagePlanner.style.display = 'block';

    // command both engines to draw ONLY the stuff for this specific folder
    renderCategories();
    renderLocations();
}


// ==========================================
// ENGINE 1: DYNAMIC CATEGORIES TRACKER
// ==========================================
let catContainer = document.getElementById('categories-container');
let addCatBtn = document.getElementById('add-cat-btn');

function renderCategories() {
    // guard clause: if we aren't inside a trip, don't run this code
    if (!activeTripId) return; 

    // point to the open folder
    let currentTrip = masterTripsArray.find(t => t.id === activeTripId);
    
    // save master array to hard drive
    localStorage.setItem('myMasterTrips', JSON.stringify(masterTripsArray));
    
    let allCatHTML = "";

    // notice we are looping over currentTrip.categories now, not the old array
    for (let i = 0; i < currentTrip.categories.length; i++) {
        let cat = currentTrip.categories[i];
        let isChecked = cat.checked ? "checked" : "";
        let textStyle = cat.checked ? "text-decoration: line-through; color: gray;" : "";

        allCatHTML += `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
                <input type="checkbox" id="cat-check-${i}" ${isChecked} style="margin-right: 10px;">
                <span style="${textStyle} flex-grow: 1;">${cat.name}</span>
                <button id="cat-del-${i}" style="background-color: #ff4d4d; color: white; padding: 2px 6px; font-size: 12px; margin-left: 10px; border: none; border-radius: 3px; cursor: pointer;">delete</button>
            </li>
        `;
    }
    
    catContainer.innerHTML = allCatHTML;

    // attach listeners
    for (let i = 0; i < currentTrip.categories.length; i++) {
        let checkbox = document.getElementById(`cat-check-${i}`);
        checkbox.addEventListener('change', function() {
            currentTrip.categories[i].checked = checkbox.checked;
            renderCategories();
        });

        let delBtn = document.getElementById(`cat-del-${i}`);
        delBtn.addEventListener('click', function() {
            currentTrip.categories.splice(i, 1);
            renderCategories();
        });
    }
}

// new category listener
addCatBtn.addEventListener('click', function() {
    if (!activeTripId) return;
    let currentTrip = masterTripsArray.find(t => t.id === activeTripId);

    let newCatName = document.getElementById('new-cat-input').value;
    if (newCatName.trim() === "") {
        alert("please enter a category!");
        return;
    }
    
    // push straight into the nested array
    currentTrip.categories.push({ name: newCatName, checked: false });
    renderCategories();
    document.getElementById('new-cat-input').value = "";
});


// ==========================================
// ENGINE 2: LOCATION CARDS
// ==========================================
let container = document.getElementById('locations-container');
let addButton = document.getElementById('add-btn');

function renderLocations() {
    if (!activeTripId) return;
    let currentTrip = masterTripsArray.find(t => t.id === activeTripId);

    localStorage.setItem('myMasterTrips', JSON.stringify(masterTripsArray));
    let allHTML = "";

    for (let i = 0; i < currentTrip.locations.length; i++) {
        let spot = currentTrip.locations[i]; 
        let cardColor = "white";
        let buttonText = "mark as visited";

        if (spot.visited === true) {
            cardColor = "#d4edda";
            buttonText = "visited!";
        }

        let cardHTML = `
            <div class="locations" id="card-${i}" style="background-color: ${cardColor};">
                <h3 style="margin-top: 0;">${spot.name}</h3>
                <p><strong>category:</strong> ${spot.category}</p>
                <p><strong>notes:</strong> ${spot.notes}</p>
                <button id="btn-${i}">${buttonText}</button>
                <button id="delete-btn-${i}" style="background-color: #ff4d4d; color: white; margin-left: 10px;">delete</button>
            </div>
        `;
        allHTML += cardHTML;
    }

    container.innerHTML = allHTML;

    for (let i = 0; i < currentTrip.locations.length; i++) {
        let button = document.getElementById(`btn-${i}`);
        button.addEventListener('click', function() {
            currentTrip.locations[i].visited = !currentTrip.locations[i].visited;
            renderLocations();
        });

        let deleteButton = document.getElementById(`delete-btn-${i}`);
        deleteButton.addEventListener('click', function(){
            currentTrip.locations.splice(i,1);
            renderLocations();
        });
    }
}

// ==========================================
// ENGINE 3: DATA MANAGEMENT (EXPORT/IMPORT/DELETE)
// ==========================================

// 1. DELETE TRIP LOGIC (attached to the inline html button)
window.deleteTrip = function(tripId) {
    // guard clause to make sure they didnt click it by accident
    let confirmDelete = confirm("yo are you sure you want to delete this entire trip?");
    if (!confirmDelete) return;

    // filter out the deleted trip and overwrite the master array
    masterTripsArray = masterTripsArray.filter(t => t.id !== tripId);
    
    // redraw the dashboard (which auto-saves to local storage!)
    renderDashboard();
}

// 2. EXPORT TRIP LOGIC
let btnExport = document.getElementById('btn-export');
btnExport.addEventListener('click', function() {
    // grab the folder we are currently looking at
    let currentTrip = masterTripsArray.find(t => t.id === activeTripId);
    
    // turn it into a string and scramble it into base64
    let saveCode = btoa(JSON.stringify(currentTrip));
    
    // copy to clipboard
    navigator.clipboard.writeText(saveCode).then(function() {
        alert("success! trip code copied to clipboard. text it to your friends!");
    }).catch(function() {
        prompt("your browser blocked the auto-copy. copy it manually here:", saveCode);
    });
});

// 3. IMPORT TRIP LOGIC
let btnImport = document.getElementById('btn-import');
btnImport.addEventListener('click', function() {
    let pastedCode = prompt("paste the trip code here:");
    if (!pastedCode) return; // they hit cancel

    try {
        // unscramble and parse the code back into a javascript object
        let importedTrip = JSON.parse(atob(pastedCode));
        
        // give it a brand new unique id so it doesn't conflict if you import it twice
        importedTrip.id = "trip_" + Date.now();
        
        // shove it into the filing cabinet and redraw the screen
        masterTripsArray.push(importedTrip);
        renderDashboard();
        
        alert("trip successfully imported!");
    } catch (error) {
        alert("bruh that code is invalid or corrupted.");
        console.error(error);
    }
});

// new location listener
addButton.addEventListener('click', function() {
    if (!activeTripId) return;
    let currentTrip = masterTripsArray.find(t => t.id === activeTripId);

    let nameInput = document.getElementById('new-name').value;
    let categoryInput = document.getElementById('new-category').value;
    let notesInput = document.getElementById('new-notes').value;

    if (nameInput.trim() === "") {
        alert("please enter a location name before saving!");
        return; 
    }

    if (categoryInput.trim() === "") {
        alert("please enter a category type before saving!");
        return; 
    }

    let newLocation = {
        name: nameInput,
        category: categoryInput,
        notes: notesInput,
        visited: false
    };

    currentTrip.locations.push(newLocation);
    renderLocations();
    
    document.getElementById('new-name').value = "";
    document.getElementById('new-category').value = "";
    document.getElementById('new-notes').value = "";
});

// INITIALIZATION
// run this once to draw the dashboard the second you open the website
renderDashboard();