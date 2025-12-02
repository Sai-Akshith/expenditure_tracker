// js/db.js
console.log("db.js loaded");

// Ensure firebase + auth + firestore are loaded
if (!firebase.firestore) {
  console.error("❌ Firestore not loaded. Include firebase-firestore-compat.js");
}
if (!firebase.auth) {
  console.error("❌ Firebase Auth not loaded. Include firebase-auth-compat.js");
}

const db = firebase.firestore();

/**
 * Add a new entry for the logged-in user
 */
async function addEntry(entry) {
  if (!window.currentUser) {
    alert("Please login first.");
    throw new Error("User not logged in");
  }

  console.log("Adding entry →", entry);

  const uid = window.currentUser.uid;

  entry.createdAt = Date.now();

  return db
    .collection("users")
    .doc(uid)
    .collection("entries")
    .add(entry);
}

/**
 * Update an entry
 */
async function updateEntry(id, data) {
  if (!window.currentUser) throw new Error("User not logged in");

  const uid = window.currentUser.uid;

  return db
    .collection("users")
    .doc(uid)
    .collection("entries")
    .doc(id)
    .update(data);
}

/**
 * Delete an entry
 */
async function deleteEntry(id) {
  if (!window.currentUser) throw new Error("User not logged in");

  const uid = window.currentUser.uid;

  return db
    .collection("users")
    .doc(uid)
    .collection("entries")
    .doc(id)
    .delete();
}

/**
 * Subscribe to all entries for the logged-in user
 */
function subscribeToEntries(callback) {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      console.log("No user → sending empty list");
      callback([]);
      return;
    }

    const uid = user.uid;

    return db
      .collection("users")
      .doc(uid)
      .collection("entries")
      .orderBy("date")
      .onSnapshot(
        snapshot => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          callback(items);
        },
        error => console.error("🔥 Firestore realtime error:", error)
      );
  });
}

/**
 * Format money
 */
function format(amount) {
  if (isNaN(amount)) return "₹0.00";
  return "₹" + amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
