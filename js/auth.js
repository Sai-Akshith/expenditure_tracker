console.log("auth.js loaded");

// Firebase Auth provider
const provider = new firebase.auth.GoogleAuthProvider();

document.getElementById("login-btn").onclick = () => {
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      console.log("Logged in:", result.user);
    })
    .catch(err => console.error(err));
};

document.getElementById("logout-btn").onclick = () => {
  firebase.auth().signOut();
};

firebase.auth().onAuthStateChanged(user => {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userInfo = document.getElementById("user-info");

  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    userInfo.textContent = "Logged in as: " + user.email;

    window.currentUser = user; // so add.js can use it
  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    userInfo.textContent = "";
    window.currentUser = null;
  }
});
