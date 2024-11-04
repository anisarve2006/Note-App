// Redirect function for login and register buttons
function redirectTo(page) {
    if (page === 'login') {
        window.location.href = 'user/login';  // Replace with actual login page URL
    } else if (page === 'register') {
        window.location.href = 'user/create';  // Replace with actual registration page URL
    }
}
