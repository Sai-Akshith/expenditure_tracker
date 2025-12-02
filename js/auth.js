// js/auth.js
console.log("auth.js loaded");

const provider = new firebase.auth.GoogleAuthProvider();

// Detect current page
const isLoginPage = window.location.pathname.includes("login.html");

// 1. LOGIN FUNCTION
const loginBtn = document.getElementById("google-login-btn");
if (loginBtn) {
  loginBtn.onclick = () => {
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        console.log("✅ Logged in:", result.user);
        // Redirect to dashboard immediately after login
        window.location.href = "index.html";
      })
      .catch((err) => {
        console.error("❌ Login error:", err);
        alert("Login failed.");
      });
  };
}

// 2. LOGOUT FUNCTION
// We now attach this to the Navbar Logout button
const logoutBtn = document.getElementById("nav-logout-btn");
if (logoutBtn) {
  logoutBtn.onclick = () => {
    firebase.auth().signOut().then(() => {
      console.log("👋 User logged out");
      window.location.href = "login.html";
    });
  };
}

// 3. GATEKEEPER LOGIC (Redirects)
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User IS logged in
    console.log("🔐 User detected:", user.email);
    window.currentUser = user;

    // If they are on the login page, send them to dashboard
    if (isLoginPage) {
      window.location.href = "index.html";
    }

    // Update User Info in Navbar (if it exists)
    const navUser = document.getElementById("nav-user-email");
    if (navUser) navUser.textContent = user.email;

  } else {
    // User is NOT logged in
    console.log("🚫 No user");
    window.currentUser = null;

    // If they are NOT on the login page, kick them out to login.html
    if (!isLoginPage) {
      window.location.href = "login.html";
    }
  }
});
