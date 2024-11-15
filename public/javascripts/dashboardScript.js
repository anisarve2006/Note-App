// Redirect function for login and register buttons
function redirectTo(page) {
    if (page === 'userlogin') {
        window.location.href = 'api/user/login';  // Replace with actual login page URL
    } else if (page === 'registeration') {
        window.location.href = 'api/user/create';  // Replace with actual registration page URL
    }
}
