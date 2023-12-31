"use strict"

let authService, usersService, postService;
let loginData, userData;
let icon, userFullName, userBio, newPost, currentPostId, counter, myModal;

document.addEventListener("DOMContentLoaded", ()=> {
    // Set variables
    authService = new AuthService();
    usersService = new UsersService();
    postService = new PostService();

    // Check if the use is currently logged in; if not, direct them to the index page
    const loggedIn = authService.isLoggedIn();
    if (loggedIn == false) {
        const myModal = bootstrap.Modal.getOrCreateInstance('#signInFirst');
        myModal.show();
    }


    icon = document.querySelector(".bi-person-circle");
    userFullName = document.getElementById("userFullName");
    userBio = document.getElementById("userBio");
    newPost = document.getElementById("newPost");

    const postItButton = document.getElementById("postItButton");

    // Register events
    postItButton.addEventListener("click", saveNewPost);

    // Call these functions when the page loaded
    displayUserInfo();
})

async function displayUserInfo() {
    loginData = await authService.getLoginData();
    userData = await usersService.getCurrent(loginData);
    
    icon.setAttribute("id", userData.icon);
    userFullName.innerText = userData.fullName;
    if (userData.bio == null || userData.bio == "") {
        userBio.innerText = "Spill the tea on your awesome self!"
        userBio.insertAdjacentHTML("afterend", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
            </svg>`)
    }
    else userBio.innerText = userData.bio;

    // The following is needed to get the query string of the current page
    // It will then check if it has the word "_id"
    const urlParam = new URLSearchParams(location.search);
    currentPostId = -1;
    counter = 0;
    if (urlParam.has("id") == true) {
        currentPostId = urlParam.get("id");

        const currentPost = await postService.getOne(currentPostId, loginData);
        newPost.value = currentPost.text;
        counter++;
    }
}

async function saveNewPost(event) {
    event.preventDefault();
    const postInfo = {
        text: newPost.value
    }

    if (counter == 0) {
        const posted = await postService.add(postInfo, loginData);
        closeMessage();
    }
    else {
        const updated = await postService.updatePost(currentPostId, loginData, postInfo);
        if (updated.status >= 200 && updated.status < 300) {
            document.getElementById("updateModal").innerHTML = `<div class="modal fade" id="updated" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
                                                                    <div class="modal-dialog">
                                                                        <div class="modal-content">
                                                                            <div class="modal-header">
                                                                                <h1 class="modal-title fs-5">Post has been successfully updated!</h1>
                                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="closeMessage()"></button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>`
            myModal = new bootstrap.Modal('#updated');
            myModal.show();
        }
    }
}

// For logout
async function logoutButtonCliked() {
    await authService.logout();
    // localStorage.removeItem("login-data");
    // location.href = "/index.html"
}

function editButtonClicked() {
    location.href = "edit-profile.html";
}

// For modal sign-in message
function closeModal() {
    location.href = "/index.html";
}

// For modal update message
function closeMessage() {
    // Direct it to my-posts page
    location.href = "/my-posts-page/my-posts.html"
}