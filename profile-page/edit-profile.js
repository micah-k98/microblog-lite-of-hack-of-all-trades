"use strict"

let authService, usersService;
let loginData, userData;
let newUsername, newName, newBio, newPassword, updateButton, myModal;

document.addEventListener("DOMContentLoaded", ()=> {
    // Set variables
    authService = new AuthService();
    usersService = new UsersService();

    // Check if the use is currently logged in; if not, direct them to the index page
    const loggedIn = authService.isLoggedIn();
    if (loggedIn == false) {
        const myModal = bootstrap.Modal.getOrCreateInstance('#signInFirst');
        myModal.show();
    }
    

    newUsername = document.getElementById("newUsername");
    newName = document.getElementById("newName");
    newBio = document.getElementById("newBio");
    newPassword = document.getElementById("newPassword");

    updateButton = document.getElementById("updateButton");
    myModal = bootstrap.Modal.getOrCreateInstance('#updatedMessage');

    // Register events
    updateButton.addEventListener("click", updateButtonClicked)

    // Call these functions when the page loaded
    loadCurrentData();
})

async function loadCurrentData() {
    loginData = await authService.getLoginData();
    userData = await usersService.getCurrent(loginData);

    newUsername.value = userData.username;
    newName.value = userData.fullName;
    newBio.value = userData.bio;
}

async function updateButtonClicked(event) {
    event.preventDefault();

    const newData = {
        username: newUsername.value,
        fullName: newName.value,
        bio: newBio.value,
        password: newPassword.value
    }
    
    const updated = await usersService.updateInfo(loginData, newData);

    if (updated.status >= 200 && updated.status < 300) {
        const userLogin = {
            "username": newData.username,
            "password": newData.password
        }
        await usersService.changeLoginData(userLogin);
        myModal.show();
    }
}

function closeMessage() {
    location.href = "profile.html";
}


// For logout
async function logoutButtonCliked() {
    await authService.logout();
    // localStorage.removeItem("login-data");
    // location.href = "/index.html"
}

// For modal sign-in message
function closeModal() {
    location.href = "/index.html";
}