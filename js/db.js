// js/db.js

// Add a new entry
async function addEntry(entry) {
  entry.createdAt = Date.now();
  const result = await db.collection("entries").add(entry);
  return result.id;
}

// Update an entry
async function updateEntry(id, data) {
  await db.collection("entries").doc(id).update(data);
}

// Delete an entry
async function deleteEntry(id) {
  await db.collection("entries").doc(id).delete();
}

// Subscribe to all entries (real-time across devices)
function subscribeToEntries(callback) {
  return db
    .collection("entries")
    .orderBy("date")
    .onSnapshot((snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(items);
    });
}

// Formatting helper (used by UI)
function format(amount) {
  if (isNaN(amount)) return "₹0";
  return "₹" + amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
