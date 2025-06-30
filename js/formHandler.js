document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault();



    const fullName = document.getElementById("fullName").value.trim();
    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const NIN = document.getElementById("nin").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const location = document.getElementById("location").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!fullName || !age || !gender || !NIN || !phone || !location || !email || !password || !confirmPassword) {
        alert("Please fill in all required fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (age < 20 || age > 30) {
        alert("Only youth between 20 and 30 years old can register.");
        return;
    }

    const data = {
        fullName,
        age,
        gender,
        NIN,
        phone,
        email,
        location,
        password, // In production, NEVER store plain passwords
        registrationDate: new Date().toISOString()
    };

    // Log it to console (for now)
    console.log("✅ Farmer Registered:", data);

    alert("Registration successful!");
    this.reset();

    // Redirect to home page
    window.location.href = "index.html"; // Change to your real homepage if different
});



