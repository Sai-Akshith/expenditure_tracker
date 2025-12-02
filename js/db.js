console.log("db.js loaded");

if (!firebase.firestore) console.error("❌ Firestore not loaded");
if (!firebase.auth) console.error("❌ Auth not loaded");

const dbRef = db;   // use db from firebase-init.js

async function addEntry(entry) {
  if (!window.currentUser) {
    alert("Please login first.");
    throw new Error("User not logged in");
  }

  console.log("Adding entry →", entry);
  const uid = window.currentUser.uid;
  entry.createdAt = Date.now();

  return dbRef
    .collection("users")
    .doc(uid)
    .collection("entries")
    .add(entry);
}

async function updateEntry(id, data) {
  const uid = window.currentUser.uid;

  return dbRef
    .collection("users")
    .doc(uid)
    .collection("entries")
    .doc(id)
    .update(data);
}

async function deleteEntry(id) {
  const uid = window.currentUser.uid;

  return dbRef
    .collection("users")
    .doc(uid)
    .collection("entries")
    .doc(id)
    .delete();
}

function subscribeToEntries(callback) {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) return callback([]);

    const uid = user.uid;

    return dbRef
      .collection("users")
      .doc(uid)
      .collection("entries")
      .order
