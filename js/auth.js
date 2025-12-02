console.log("auth.js loaded");

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Elements
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");

// Login
loginBtn.addEventListener("click", () => {
  auth.signInWithPopup(provider).catch(console.error);
});

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

// Auth state listener
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Logged in:", user.displayName);

    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    userInfo.innerText = `Logged in as: ${user.email}`;
    
    window.currentUser = user; // store globally
  } else {
    console.log("Logged out");

    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    userInfo.innerText = "";

    window.currentUser = null;
  }
});
