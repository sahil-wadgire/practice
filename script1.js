function showTime() {
	document.getElementById('currentTime').innerHTML = new Date().toUTCString();
}
showTime();
setInterval(function () {
	showTime();
}, 1000);

// Keep count of deleted items
var deleteCount = 0;


function clearLocalStorage()
{
    localStorage.clear();
    localStorageData=[];
    deleteCount=0;
}
// const deleted = [];
var localStorageData = [];
// localStorage.clear();

// Pre-defined array of user data
var usersData = [
    { firstName: "John", email: "john@example.com" },
    { firstName: "Alice", email: "alice@example.com" },
    { firstName: "Sahil", email: "sahilwadgire@gmail.com" }
];

function storeUserData(data) {
    data.forEach(function(user, index) {
        localStorage.setItem(index, JSON.stringify(user));
    });
}

function showData() {
  var element = localStorage.getItem("0");
  document.getElementById("1").innerHTML = element;
}

//retrieve data
function retrieveData()
{
  var numRows = 2; 
  localStorageData=[];
    for (var i = 0; i < localStorage.length+deleteCount; i++) 
    {
      
    var userDataJSON = localStorage.getItem(i);
      // if(deleted.includes(i))
      // {
      //   continue;
      // }
      if (userDataJSON) {
          // Parse the JSON data and push it into the array
          localStorageData.push(JSON.parse(userDataJSON));
      }
    }
    populateTable(localStorageData);
}


function addUser() {
    var nameInput = document.getElementById('firstName').value;
    var emailInput = document.getElementById('email').value;

    if (nameInput.trim() === '' || emailInput.trim() === '') {
        alert("Please enter valid values for both fields.");
        return;
    }

    // Check if the email is already present in local storage
    for (var i = 0; i < localStorage.length+deleteCount; i++) {
        var userDataJSON = localStorage.getItem(i);
        if (userDataJSON) {
            var userData = JSON.parse(userDataJSON);
            if (userData.email === emailInput) {
                alert("Email already exists in local storage!");
                return; // Exit the function if email already exists
            }
        }
    }

    // If email is not present, proceed with adding the data
    var newData = { firstName: nameInput, email: emailInput };
    usersData.push(newData);
    
    localStorage.setItem(localStorage.length, JSON.stringify(newData));
    
    retrieveData();
}

function deleteElement(email) {
    for (var i = 0; i < localStorage.length+deleteCount; i++) {
        var userDataJSON = localStorage.getItem(i);
        if (userDataJSON) {
            var userData = JSON.parse(userDataJSON);
            if (userData.email === email) {
                localStorage.removeItem(i);
                deleteCount++;
                retrieveData();
                return; // Exit the function after deleting the item
            }
        }
    }
}

async function validateEmail(email, validateBtn) {
    const apiKey = "ema_live_X9M7AVAJu9clB2xCbCIfhI2yRlqhBfbxWwxYRBOh";
    const url = `https://api.emailvalidation.io/v1/info?apikey=${apiKey}&email=${email}`;
    try {
        let res = await fetch(url);
        let result = await res.json();

        // Check if smtp_check is true or false
        if (result.smtp_check === true) {
            console.log("SMTP check passed. Email is deliverable.");
            validateBtn.style.backgroundColor = "Green";
            validateBtn.textContent = "Valid Email";
            validateBtn.style.color = "white";
        } else {
            console.log("SMTP check failed. Email may not be deliverable.");
            validateBtn.style.backgroundColor = "Red";
            validateBtn.textContent = "Invalid Email";
            validateBtn.style.color = "white";
        }
    } catch (error) {
        console.error("Error occurred while validating email:", error);
    }
}

// Function to populate the table with data
function populateTable(data) 
{
  var tableBody = document.querySelector("#dataTable tbody");

  // Clear existing table data
  tableBody.innerHTML = "";

  // Iterate over the data and create table rows
  data.forEach(function(user,index) 
  {
    var row = document.createElement("tr");
    if (index % 2 === 0) 
    {
        row.classList.add("even");
    } else {
        row.classList.add("odd");
    }
    // Create and populate table cells
    var idCell = document.createElement("td");
    idCell.textContent = index;
    row.appendChild(idCell);
    
    var firstNameCell = document.createElement("td");
    var firstNameInput = document.createElement("input");
    firstNameInput.type = "text";
    firstNameInput.disabled = true;
    firstNameInput.value = user.firstName;
    firstNameCell.appendChild(firstNameInput);
    row.appendChild(firstNameCell);

    var emailCell = document.createElement("td");
    var emailInput = document.createElement("input");
    emailInput.type = "text";
    emailInput.disabled = true;
    emailInput.value = user.email;
    emailCell.appendChild(emailInput);
    row.appendChild(emailCell);
    
    var deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function() {
        deleteElement(user.email);
    }
    row.appendChild(deleteBtn);
    
    var editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = function(){
      emailInput.disabled = false;
      firstNameInput.disabled = false;
      editBtn.textContent = "save";
      
    }
    row.appendChild(editBtn);
    
    // Create email validation button
    var validateBtn = document.createElement("button");
    validateBtn.textContent = "Validate Email";
    validateBtn.style.backgroundColor = "pink";
    validateBtn.onclick = function() {
        validateEmail(emailInput.value, validateBtn);
    };
    validateBtn.style.margin = "5px";
    row.appendChild(validateBtn);

        tableBody.appendChild(row);
    });
}


// Run this code when the page loads
window.onload = function() {
    storeUserData(usersData);
    retrieveData();
    showData();
};