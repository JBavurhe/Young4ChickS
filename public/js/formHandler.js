//1. Register form handler



document.addEventListener('DOMContentLoaded', () => {
    const roleSelect = document.getElementById('role');
    const farmerFields = document.getElementById('farmerFields');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const confirmFeedback = confirmPassword.nextElementSibling;

    // Show/hide farmer fields
    roleSelect.addEventListener('change', () => {
        farmerFields.style.display = roleSelect.value === 'farmer' ? 'block' : 'none';
    });

    // Toggle password visibility
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            toggle.classList.toggle('fa-eye-slash');
        });
    });

    // Real-time password match check
    const checkPasswordMatch = () => {
        if (confirmPassword.value === '') {
            confirmPassword.classList.remove('is-invalid', 'is-valid');
            return;
        }

        if (password.value === confirmPassword.value) {
            confirmPassword.classList.remove('is-invalid');
            confirmPassword.classList.add('is-valid');
            confirmFeedback.style.display = 'none';
        } else {
            confirmPassword.classList.remove('is-valid');
            confirmPassword.classList.add('is-invalid');
            confirmFeedback.textContent = 'Passwords do not match.';
            confirmFeedback.style.display = 'block';
        }
    };

    password.addEventListener('input', checkPasswordMatch);
    confirmPassword.addEventListener('input', checkPasswordMatch);

    // Bootstrap validation
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    });
});



// This code handles the registration form submission, validates the input, and logs the data to the console.

//2. login form handler


const form = document.getElementById('loginForm');
const email = document.getElementById('emailInput');
const password = document.getElementById('passwordInput');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent form submission
    let valid = true;

    // Email validation
    const emailValue = email.value.trim();
    const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

    if (!emailValue || !emailPattern.test(emailValue)) {
        email.classList.add('is-invalid');
        email.classList.remove('is-valid');
        valid = false;
    } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }

    // Password validation
    const passwordValue = password.value.trim();

    if (passwordValue.length < 8) {
        password.classList.add('is-invalid');
        password.classList.remove('is-valid');
        valid = false;
    } else {
        password.classList.remove('is-invalid');
        password.classList.add('is-valid');
    }

    const togglePassword = document.getElementById('togglePassword');

    password.addEventListener('input', () => {
        togglePassword.style.display = password.value.length > 0 ? 'block' : 'none';
    });

    togglePassword.addEventListener('click', () => {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        togglePassword.classList.toggle('bi-eye');
        togglePassword.classList.toggle('bi-eye-slash');
    });

    // If all fields valid, you can proceed (send to server)
    if (valid) {
        alert("Form is valid. Submitting...");
        // form.submit(); // Uncomment this if you're ready to submit to server
    }
});




//3. chickRequest Form handler

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("chickRequestForm");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const quantity = document.getElementById("quantity");
            const breed = document.getElementById("breed");
            const deliveryDate = document.getElementById("deliveryDate");
            const deliveryLocation = document.getElementById("deliveryLocation");
            const purpose = document.getElementById("purpose");
            const notes = document.getElementById("notes");

            const inputs = [quantity, breed, deliveryDate, deliveryLocation, purpose];

            // Clear validation
            inputs.forEach(input => input.classList.remove("is-invalid"));

            let valid = true;

            if (!quantity.value || parseInt(quantity.value) < 1) {
                quantity.classList.add("is-invalid");
                valid = false;
            }

            if (!breed.value) {
                breed.classList.add("is-invalid");
                valid = false;
            }

            if (!deliveryDate.value) {
                deliveryDate.classList.add("is-invalid");
                valid = false;
            }

            if (!deliveryLocation.value.trim()) {
                deliveryLocation.classList.add("is-invalid");
                valid = false;
            }

            if (!purpose.value) {
                purpose.classList.add("is-invalid");
                valid = false;
            }

            if (!valid) return;

            const requestData = {
                quantity: quantity.value,
                breed: breed.value,
                deliveryDate: deliveryDate.value,
                deliveryLocation: deliveryLocation.value,
                purpose: purpose.value,
                notes: notes.value.trim(),
                submittedAt: new Date().toISOString()
            };

            console.log("🐣 Chick Request Submitted:", requestData);
            form.reset();

            // Clear feedback
            inputs.forEach(input => input.classList.remove("is-invalid", "is-valid"));

            // Optional: redirect or show success message
            alert("Your request has been submitted!");
            window.location.href = "home.html";
        });
    }
});

//4. Sales Agent form

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("agentRegisterForm");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("agentName");
            const email = document.getElementById("agentEmail");
            const phone = document.getElementById("agentPhone");
            const region = document.getElementById("agentRegion");
            const password = document.getElementById("agentPassword");

            const inputs = [name, email, phone, region, password];
            inputs.forEach(input => input.classList.remove("is-invalid"));

            let valid = true;

            if (!name.value.trim()) {
                name.classList.add("is-invalid");
                valid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value.trim())) {
                email.classList.add("is-invalid");
                valid = false;
            }

            if (!phone.value.trim()) {
                phone.classList.add("is-invalid");
                valid = false;
            }

            if (!region.value.trim()) {
                region.classList.add("is-invalid");
                valid = false;
            }

            if (password.value.length < 8) {
                password.classList.add("is-invalid");
                valid = false;
            }

            if (!valid) return;

            const agent = {
                fullName: name.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                region: region.value.trim(),
                password: password.value.trim(),
                createdAt: new Date().toISOString()
            };

            console.log("👤 New Sales Agent Registered:", agent);
            form.reset();
            alert("Sales Agent registered successfully!");
            window.location.href = "index.html";
        });
    }
});
