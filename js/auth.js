// js/auth.js
console.log("auth.js loaded");

// Ensure Firebase Auth is loaded
if (!firebase.auth) {
  console.error("❌ Firebase Auth library not loaded. Did you include firebase-auth-compat.js?");
}

// Google provider
const provider = new firebase.auth.GoogleAuthProvider();

// Login button
document.getElementById("login-btn").onclick = () => {
  firebase.auth()
    .signInWithPopup(provider)
    .then(result => {
      console.log("✅ Logged in:", result.user);
      alert("Login successful!");
    })
    .catch(err => {
      console.error("❌ Login error:", err);
      alert("Login failed. Check console.");
    });
};

// Logout button
document.getElementById("logout-btn").onclick = () => {
  firebase.auth().signOut()
    .then(() => {
      console.log("👋 User logged out");
      alert("Logged out");
    });
};

// Auth listener (runs whenever user logs in/out)
firebase.auth().onAuthStateChanged(user => {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userInfo = document.getElementById("user-info");

  if (user) {
    console.log("🔐 User logged in:", user.email);

    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";

    userInfo.textContent = "Logged in as: " + user.email;

    // Global user object so db.js and add.js can access UID
    window.currentUser = user;
  } else {
    console.log("🚫 No user logged in");

    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    userInfo.textContent = "";

    window.currentUser = null;
  }
});
