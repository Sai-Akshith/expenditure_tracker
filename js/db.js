console.log("db.js loaded");

if (!firebase.firestore) console.error("❌ Firestore not loaded");
if (!firebase.auth) console.error("❌ Auth not loaded");

const dbRef = db;   // use db from firebase-init.js

/* -------------------------------------------------------
   ADD ENTRY
-------------------------------------------------------- */
async function addEntry(entry) {
  if (!window.currentUser) {
    alert("Please login first.");
    throw new Error("User not logged in");
  }

  console.log("Adding entry →", entry);
  const uid = window.currentUser.uid;
  
  // Add timestamp
  entry.createdAt = Date.now();

  return dbRef
    .collection("users")
    .doc(uid)
    .collection("entries")
    .add(entry);
}

/* -------------------------------------------------------
   UPDATE ENTRY
-------------------------------------------------------- */
async function updateEntry(id, data) {
  if (!window.currentUser) throw new Error("User not logged in");

  const uid = window.currentUser.uid;

  return dbRef
    .collection("users")
    .doc(uid)
    .collection("entries")
    .doc(id)
    .update(data);
}

/* -------------------------------------------------------
   DELETE ENTRY
-------------------------------------------------------- */
async function deleteEntry(id) {
  if (!window.currentUser) throw new Error("User not logged in");

  const uid = window.currentUser.uid;

  return dbRef
    .collection("users")
    .doc(uid)
    .collection("entries")
    .doc(id)
    .delete();
}

/* -------------------------------------------------------
   REALTIME LISTENER
-------------------------------------------------------- */
function subscribeToEntries(callback) {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) return callback([]);

    const uid = user.uid;

    return dbRef
      .collection("users")
      .doc(uid)
      .collection("entries")
      .orderBy("date")
      .onSnapshot(
        snap => {
          const items = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          callback(items);
        },
        err => console.error("🔥 Firestore realtime error:", err)
      );
  });
}

/* -------------------------------------------------------
   MONEY FORMATTER
-------------------------------------------------------- */
function format(amount) {
  // Ensure we are working with a Number, not a string
  const num = Number(amount);
  
  if (isNaN(num)) return "₹0.00";
  
  return "₹" + num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
