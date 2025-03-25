const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup'); 
const iconClose = document.querySelector('.icon-close');
const loginForm = document.querySelector(".form-box.login form");
const registerForm = document.querySelector(".form-box.register form");

// Switch to registration form
registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

// Switch to login form
loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

// Open popup
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

// Close popup
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const role = document.getElementById("user-role").value;
    alert(`Logged in as ${role}`);
});

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const role = document.getElementById("register-role").value;
    alert(`Registered as ${role}`);
});

