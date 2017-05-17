const loginButton = document.querySelector('#login');

function addUserLogInOrOut(element, route, callback) {
    if (element) {
        element.addEventListener('click', () => {
            window.location.href = `${window.location.origin}/${route}`;
        });
        if (callback) {
            callback();
        }
    }
}


addUserLogInOrOut(loginButton, 'login', addUserLogInOrOut(document.querySelector('#logout'), 'logout', null));
