// Initialize Google Sign-In
function initializeGoogleSignIn() {
    gapi.load('auth2', function () {
        gapi.auth2.init({
            client_id: '698111135571-om761856rjgck5toudgqj1gjqqs6sdoo.apps.googleusercontent.com',
            scope: "email",
            plugin_name: "Inteligen-ChatBot",
        });
    });
}

function startGoogleSignIn(callbackFunction) {
    // Ensure the Google Auth API is loaded
    if (gapi.auth2) {
        var auth2 = gapi.auth2.getAuthInstance();

        // Sign in the user
        auth2.signIn({
            prompt: 'consent',
            scope: 'profile email'
        })
            .then(function (googleUser) {
                var id_token = googleUser.getAuthResponse().id_token;
                SendTokenToUnity(id_token);
            })
            .catch(function (error) {
                if (error.error === 'popup_closed_by_user') {
                    console.error('Google Sign-In canceled by user');
                    // Provide user-friendly feedback, e.g., display a message to the user
                    alert('Google Sign-In was canceled. Please try again.');
                } else {
                    console.error('Google Sign-In error:', error);
                    // Handle other potential errors, e.g., network errors, API errors
                }
            });
    } else {
        console.error('Google Auth API is not initialized.');
    }
}

// Function to handle token extraction and send to Unity
function SendTokenToUnity(token) {
    if (window.unityInstance) {
        window.unityInstance.SendMessage('GameObjectName', 'ReceiveGoogleToken', token);
    } else {
        console.error('Unity instance is not available.');
    }
}

// Ensure Google Sign-In API is initialized when the page loads
window.onload = function () {
    initializeGoogleSignIn();
};


