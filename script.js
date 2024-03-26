function showTime() {
    document.getElementById('currentTime').innerHTML = new Date().toUTCString();
}

showTime();
setInterval(showTime, 1000);

var localStorageData = [];

// Pre-defined array of user data
var usersData = [
    { firstName: "John", email: "john@example.com" },
    { firstName: "Alice", email: "alice@example.com" },
    { firstName: "Sahil", email: "sahilwadgire@gmail.com" }
];

// Function to store user data in localStorage
function storeUserData() {
    localStorage.setItem('users', JSON.stringify(usersData));
    populateArray();
}

// Function to retrieve data from localStorage
function populateArray() {
    var jsonData = localStorage.getItem("users");
    localStorageData = JSON.parse(jsonData);
    populateTable(localStorageData);
}

// Function to delete an element from localStorageData
function deleteElement(index) {
    localStorageData.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(localStorageData));
    populateArray();
}


// Function to add a new user
function addUser() {
    var firstName = document.getElementById("firstName").value;
    var email = document.getElementById("email").value;

    if (firstName.trim() === '' || email.trim() === '') {
        alert("Please enter valid values for both fields.");
        return;
    }

    // Check if the email already exists
    var emailExists = usersData.some(function(user) {
        return user.email === email;
    });

    if (emailExists) {
        alert("Email already exists. Please use a different email.");
        return;
    }

    var newUser = { firstName: firstName, email: email };
    usersData.push(newUser);
    storeUserData();
    clearInputFields();
}

// Function to save edited user
function saveEditedUser(index, firstName, email) {
    // Check if the email already exists
    var emailExists = usersData.some(function(user, i) {
        return i !== index && user.email === email;
    });

    if (emailExists) {
        alert("Email already exists. Please use a different email.");
        return;
    }

    usersData[index].firstName = firstName;
    usersData[index].email = email;
    storeUserData();
    populateArray();
}

// Function to clear input fields after adding a new user
function clearInputFields() {
    document.getElementById("firstName").value = '';
    document.getElementById("email").value = '';
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
function populateTable(data) {
    var tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";

    data.forEach(function(user, index) {
        var row = document.createElement("tr");
        if (index % 2 === 0) 
        {
            row.classList.add("even");
        } else {
            row.classList.add("odd");
        }
        var Id = document.createElement("td");
        var IdLable = document.createElement("label");
        IdLable.textContent = index;
        Id.appendChild(IdLable);
        row.appendChild(Id);

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
            deleteElement(index);
        }
        deleteBtn.style.margin = "5px";
        row.appendChild(deleteBtn);

        var editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = function() {
            firstNameInput.disabled = false;
            emailInput.disabled = false;
            editBtn.textContent = "Save";
            editBtn.onclick = function() {
                saveEditedUser(index, firstNameInput.value, emailInput.value);
            };
        }
        editBtn.style.margin = "5px";
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
    storeUserData();
    populateArray();
};
