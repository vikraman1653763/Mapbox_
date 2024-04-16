//otp.js//
function sendOTP() {
    const { isValid, emailValue,usernameValue } = validateInputs();
    
    if (!isValid) {
        return;
    }

    const otpValue = Math.floor(Math.random() * 1000000); // Generate and set OTP value

    let emailbody = `
        <h2>Your OTP is </h2><h1>${otpValue}</h1>
    `;

    // Store OTP value in localStorage
    localStorage.setItem('otpValue', otpValue);

    Email.send({
        SecureToken: "5fcffd7d-0f66-480e-9fcc-bddfcee79d28",
        To: emailValue,
        From: "vikraman1653763@gmail.com",
        Subject: "this is one time password. please dont share it with others.",
        Body: emailbody
    }).then(
        message => {
            if (message === "OK") {
                alert("OTP sent to your email " + emailValue);
                window.location.href = 'success';
            }
        }
    ).catch(error => {
        console.error("Error sending email:", error);
        alert("Error sending OTP email. Please try again.");
    });
}

const otpValue = localStorage.getItem('otpValue');

function sendUserData(emailValue) {
    // Send user data to Flask for saving
    fetch('/verify_otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: usernameValue,
            lastname: sessionStorage.getItem('lastname'),
            email: emailValue,
            password: sessionStorage.getItem('password'),
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Optionally, redirect to a success page
            window.location.href = 'success.html';
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Error sending user data:', error);
        alert('Error sending user data. Please try again.');
    });
}


function verifyOTP() {
    const otpInput = document.getElementById('otp_inp');
    
    if (otpInput) {
        // Now check whether the entered OTP is valid
        if (otpInput.value == localStorage.getItem('otpValue')) {
            // Optional alert or other actions
            localStorage.removeItem('otpValue');
            const emailValue = localStorage.getItem('email');
            const usernameValue = localStorage.getItem('username');
            const lastnameValue = localStorage.getItem('lastname');
            const passwordValue = localStorage.getItem('password');
            console.log('email:', emailValue, usernameValue, lastnameValue, passwordValue);
            alert('savedd'); 
            // Call sendUserData with user details
            sendUserData(emailValue, usernameValue, lastnameValue, passwordValue);
            window.location.href = 'login';

        } else {
            alert("Invalid OTP");
        }
    } else {
        console.error("Error: Could not find element with id 'otp_inp'");
    }
}

function sendUserData(emailValue, usernameValue, lastnameValue, passwordValue) {
    // Send user data to Flask for saving
    fetch('/verify_otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: usernameValue,
            lastname: lastnameValue,
            email: emailValue,
            password: passwordValue,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Optionally, redirect to a success page
            window.location.href = 'success.html';
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Error sending user data:', error);
        alert('Error sending user data. Please try again.');
    });
}