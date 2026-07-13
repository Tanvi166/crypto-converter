// ===============================
// Redirect if already logged in
// ===============================

if (localStorage.getItem("loggedInUser")) {
    window.location.href = "dashboard.html";
}

// ===============================
// Login Form
// ===============================

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", loginUser);

// ===============================
// Login Function
// ===============================

async function loginUser(event) {

    event.preventDefault();

    const username = document
        .getElementById("username")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value
        .trim();

    // Validation

    if (username === "" || password === "") {

        showMessage("Please fill all fields.", "orange");

        return;

    }

    try {

        const response = await fetch("../users.json");

        if (!response.ok) {
            throw new Error("Unable to load users.");
        }

        const users = await response.json();

        const validUser = users.find(user =>
            user.username === username &&
            user.password === password
        );

        if (validUser) {

            localStorage.setItem("loggedInUser", username);

            showMessage("Login Successful!", "#00d26a");

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1000);

        }

        else {

            showMessage("Invalid Username or Password!", "#ff4d4d");

        }

    }

    catch (error) {

        console.error(error);

        showMessage("Something went wrong!", "#ff4d4d");

    }

}

// ===============================
// Message Function
// ===============================

function showMessage(text, color) {

    message.innerHTML = text;

    message.style.color = color;

}