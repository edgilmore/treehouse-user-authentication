
const loginButton = document.querySelector('#login');

loginButton.addEventListener('click', (event) => {
    window.location.href = `${window.location.origin}/login`;
});
