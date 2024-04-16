//form.js
const form = document.getElementById('form');
const username = document.getElementById('username');
const lastname = document.getElementById('lastname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
let otpSent = false;
let firstErrorMessage = null;

const signUpButton = document.getElementById('sign');



const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    if (errorDisplay) {
        errorDisplay.innerText = message;
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
        showCustomAlert(message);
    }
};

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    if (errorDisplay) {
        errorDisplay.innerText = ''; // Clear the error message
        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    }
};



const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const lastnameValue = lastname.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();
    let isValid = true;
    let firstErrorMessage = null;

    if (usernameValue === '') {
        setError(username, 'Username is required');
        if (!firstErrorMessage) {
            firstErrorMessage = 'Username is required';
        }
        isValid = false;
    } else {
        setSuccess(username);
        sessionStorage.setItem('username', usernameValue);
    }

    if (lastnameValue === '') {
        setError(lastname, 'Last name is required');
        if (!firstErrorMessage) {
            firstErrorMessage = 'Last name is required';
        }
        isValid = false;
    } else {
        setSuccess(lastname);
        sessionStorage.setItem('lastname',lastnameValue);

    }

    if (emailValue === '') {
        setError(email, 'Email is required');
        if (!firstErrorMessage) {
            firstErrorMessage = 'Email is required';
        }
        isValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
        if (!firstErrorMessage) {
            firstErrorMessage = 'Please provide a valid email';
        }
        isValid = false;
    } else {
        setSuccess(email);
        sessionStorage.setItem('email',emailValue);
    }

    if (passwordValue === '') {
        setError(password, 'Password is required');
        if (!firstErrorMessage) {
            firstErrorMessage = 'Password is required';
        }
        isValid = false;
    } else if (passwordValue.length < 1) {
        setError(password, 'Password must be at least 8 characters.');
        if (!firstErrorMessage) {
            firstErrorMessage = 'Password must be at least 8 characters';
        }
        isValid = false;
    } else {
        setSuccess(password);
    }

    if (password2Value === '') {
        setError(password2, 'Please confirm your password');
        if (!firstErrorMessage) {
            firstErrorMessage = 'Please confirm your password';
        }
        isValid = false;
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords don't match");
        if (!firstErrorMessage) {
            firstErrorMessage = "Passwords don't match";
        }
        isValid = false;
    } else {
        setSuccess(password2);
        sessionStorage.setItem('password', password2Value);
    }

    if (!isValid && firstErrorMessage) {
        
        console.log(firstErrorMessage);
        sendErrorMessage(firstErrorMessage);

    }
    
    return { isValid, emailValue};

};

function sendErrorMessage(errorMessage) {
    const formData = new FormData();
    formData.append('errorMessage', errorMessage);

    fetch('/register', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Store input values in local storage before reloading
            sessionStorage.setItem('username', username.value.trim());
            sessionStorage.setItem('lastname', lastname.value.trim());
            sessionStorage.setItem('email', email.value.trim());
            sessionStorage.setItem('password', password.value.trim());
            sessionStorage.setItem('password2', password2.value.trim());

            // Reload the page after successfully sending the error message
            window.location.reload();
        } else {
            // Handle errors if needed
            console.error('Error sending error message:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error sending error message:', error);
    });
}

// Function to populate input fields with values from local storage
function populateInputFields() {
    username.value = sessionStorage.getItem('username') || '';
    lastname.value = sessionStorage.getItem('lastname') || '';
    email.value = sessionStorage.getItem('email') || '';
    password.value = sessionStorage.getItem('password') || '';
    password2.value = sessionStorage.getItem('password2') || '';
}

// Call populateInputFields function to populate input fields after page reload
populateInputFields();
function setSessionStorageTimer() {
    setTimeout(() => {
        sessionStorage.clear();
    }, 5000); // 5000 milliseconds = 5 seconds
}
form.addEventListener('submit', e => {
    e.preventDefault();
    const { isValid} = validateInputs();
    if (isValid && !otpSent) {
        sendOTP();
        otpSent = true;
        setSessionStorageTimer(); 
    } 
});

// Clear local storage when form is submitted
form.addEventListener('submit', () => {
    sessionStorage.clear();
});
