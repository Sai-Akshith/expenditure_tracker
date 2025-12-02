// js/db.js

console.log("db.js loaded");

// Add a new entry
async function addEntry(entry) {
  console.log("Adding entry →", entry);
  entry.createdAt = Date.now();
  return db.collection("entries").add(entry);
}

// Update an entry
async function updateEntry(id, data) {
  return db.collection("entries").doc(id).update(data);
}

// Delete an entry
async function deleteEntry(id) {
  return db.collection("entries").doc(id).delete();
}

// Subscribe to all entries (real-time across devices)
function subscribeToEntries(callback) {
  return db
    .collection("entries")
    .orderBy("date")
    .onSnapshot(
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(items);
      },
      (error) => console.error("🔥 Firestore realtime error:", error)
    );
}

// Formatting helper
function format(amount) {
  if (isNaN(amount)) return "₹0";
  return "₹" + amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
