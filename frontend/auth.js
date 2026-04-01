const API_URL = "https://notesvault-ho8t.onrender.com/api/auth";

if (localStorage.getItem("token")) {
    window.location.href = "dashboard.html";
}

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const otpForm = document.getElementById("otpForm");
const forgotForm = document.getElementById("forgotForm");
const resetForm = document.getElementById("resetForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const showForgot = document.getElementById("showForgot");
const backToLogin = document.getElementById("backToLogin");

let userEmailForOtp = "";
showRegister.addEventListener("click", () => {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
});

showLogin.addEventListener("click", () => {
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
});

showForgot.addEventListener("click", () => {
    loginForm.classList.add("hidden");
    forgotForm.classList.remove("hidden");
});

backToLogin.addEventListener("click", () => {
    forgotForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            alert("OTP sent to your email!"); 
            userEmailForOtp = email;
            registerForm.classList.add("hidden");
            otpForm.classList.remove("hidden");
        } else {
            alert(data.msg);
        }
    } catch (err) {
        alert("Server error.");
    }
});

otpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const otp = document.getElementById("otpCode").value;

    try {
        const res = await fetch(`${API_URL}/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmailForOtp, otp })
        });
        const data = await res.json();

        if (res.ok) {
            alert("Account Verified! Please login.");
            otpForm.classList.add("hidden");
            loginForm.classList.remove("hidden");
            document.getElementById("loginEmail").value = userEmailForOtp;
        } else {
            alert(data.msg);
        }
    } catch (err) {
        alert("Server error.");
    }
});
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html";
        } else {
            alert(data.msg);
            if(data.msg === "Verify OTP first") {
                userEmailForOtp = email;
                loginForm.classList.add("hidden");
                otpForm.classList.remove("hidden");
            }
        }
    } catch (err) {
        alert("Server error.");
    }
});
forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value;
    userEmailForOtp = email;

    try {
        const res = await fetch(`${API_URL}/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (res.ok) {
            alert("Reset OTP sent to your email!");
            forgotForm.classList.add("hidden");
            resetForm.classList.remove("hidden");
        } else {
            alert(data.msg);
        }
    } catch (err) {
        alert("Server error.");
    }
});
resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const otp = document.getElementById("resetOtp").value;
    const newPassword = document.getElementById("newPassword").value;

    try {
        const res = await fetch(`${API_URL}/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmailForOtp, otp, newPassword })
        });
        const data = await res.json();

        if (res.ok) {
            alert("Password reset successful! Please login.");
            resetForm.classList.add("hidden");
            loginForm.classList.remove("hidden");
        } else {
            alert(data.msg);
        }
    } catch (err) {
        alert("Server error.");
    }
});