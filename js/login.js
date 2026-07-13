if (localStorage.getItem("loggedInUser")) {
    window.location.href = "dashboard.html";
}
var loginForm = document.getElementById("loginForm");
var message = document.getElementById("message");
loginForm.addEventListener("submit", loginUser);
function loginUser(event) {
    event.preventDefault();
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();
    if (username == "" || password == "") {
        showMessage("Please fill all fields.", "orange");
        return;
    }
    fetch("../users.json")
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Unable to load users.");
        }
        return response.json();
    })
    .then(function(users) {
        var found = false;
        for (var i = 0; i < users.length; i++) {
            if (users[i].username == username && users[i].password == password) {
                found = true;
                localStorage.setItem("loggedInUser", username);
                showMessage("Login Successful!", "#00d26a");
                setTimeout(function() {
                    window.location.href = "dashboard.html";
                }, 1000);
                break;
            }
        }
        if (found == false) {
            showMessage("Invalid Username or Password!", "#ff4d4d");
        }
    })
    .catch(function(error) {
        console.log(error);
        showMessage("Something went wrong!", "#ff4d4d");
    });
}
function showMessage(text, color) {
    message.innerHTML = text;
    message.style.color = color;
}