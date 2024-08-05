let tempToken = null;

// Function to start Google Sign-In
function startGoogleSignIn(callbackFunction) {
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    let form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);

    let params = {
        "client_id": "698111135571-om761856rjgck5toudgqj1gjqqs6sdoo.apps.googleusercontent.com",
        "redirect_uri": "http://localhost:52679", // Ensure this matches your app's URL
        "response_type": "token",
        "scope": "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        "include_granted_scopes": 'true',
        'state': 'pass-through-value'
    }

    for (var p in params) {
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
}

// Function to send the token to Unity
function SendTokenToUnity(token) {
    if (window.unityInstance) {
        window.unityInstance.SendMessage('ProfileService_Playfab', 'ReceiveGoogleToken', token);
    } else {
        console.error('Unity instance is not available.');
        // Store the token temporarily
        tempToken = token;
    }
}

// Function to extract token from URL fragment and send to Unity
function handleRedirect() {
    const fragment = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = fragment.get('access_token');

    if (accessToken) {
        SendTokenToUnity(accessToken);
    } else {
        console.error('Access token not found in URL fragment.');
    }
}

// Ensure the function to handle redirect is called when the page loads
window.onload = function () {
    handleRedirect();
};

// Periodically check for Unity instance availability and send the token
setInterval(function () {
    if (tempToken && window.unityInstance) {
        window.unityInstance.SendMessage('ProfileService_Playfab', 'ReceiveGoogleToken', tempToken);
        tempToken = null; // Clear the temporary token once sent
    }
}, 1000); // Check every second
