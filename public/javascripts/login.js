
const loginButton = document.querySelector('#login');

loginButton.addEventListener('click', () => {
    window.location.href = `${window.location.origin}/login`;
});
