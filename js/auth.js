// js/auth.js
console.log("auth.js loaded");

const provider = new firebase.auth.GoogleAuthProvider();

// Detect current page
const isLoginPage = window.location.pathname.includes("login.html");

// 1. LOGIN FUNCTION
const loginBtn = document.getElementById("google-login-btn");
if (loginBtn) {
  loginBtn.onclick = async () => {
    try {
      // Add loading state to button
      loginBtn.innerHTML = "Signing in...";
      loginBtn.style.opacity = "0.7";
      
      const result = await firebase.auth().signInWithPopup(provider);
      console.log("✅ Logged in:", result.user);
      
      // Animate out before redirecting
      document.body.classList.add("page-exit-active");
      
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500); // Wait 0.5s for animation
      
    } catch (err) {
      console.error("❌ Login error:", err);
      alert("Login failed.");
      loginBtn.innerHTML = "Sign in with Google"; // Reset text
      loginBtn.style.opacity = "1";
    }
  };
}

// 2. LOGOUT FUNCTION (With Animation)
const logoutBtn = document.getElementById("nav-logout-btn");

if (logoutBtn) {
  logoutBtn.onclick = async () => {
    // 1. Trigger CSS Animation
    document.querySelector("main").classList.add("page-exit-active");
    document.querySelector("nav").classList.add("page-exit-active");

    // 2. Wait for 500ms (0.5 seconds) so user sees the animation
    await new Promise(r => setTimeout(r, 500));

    // 3. Perform actual logout
    firebase.auth().signOut().then(() => {
      console.log("👋 User logged out");
      window.location.href = "login.html";
    });
  };
}

// 3. GATEKEEPER LOGIC
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User IS logged in
    window.currentUser = user;
    if (isLoginPage) window.location.href = "index.html";

    const navUser = document.getElementById("nav-user-email");
    if (navUser) navUser.textContent = user.email;

  } else {
    // User is NOT logged in
    window.currentUser = null;
    if (!isLoginPage) window.location.href = "login.html";
  }
});
