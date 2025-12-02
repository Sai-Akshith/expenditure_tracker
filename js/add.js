// js/add.js
console.log("add.js loaded");

const form = document.getElementById("entry-form");
const dateInput = document.getElementById("date");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const methodInput = document.getElementById("method");
const descriptionInput = document.getElementById("description");

// Default date = today
if (!dateInput.value) {
  dateInput.valueAsDate = new Date();
}

// SUBMIT HANDLER
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("🚀 FORM SUBMITTED");

  const user = firebase.auth().currentUser;

  // 🔒 Ensure user is logged in
  if (!user) {
    alert("You must be logged in to save an entry.");
    console.error("❌ No user found. Login required.");
    return;
  }

  const date = dateInput.value;
  const type = typeInput.value;
  const category = categoryInput.value;
  const amount = parseFloat(amountInput.value);
  const method = methodInput.value.trim();
  const description = descriptionInput.value.trim();

  const entry = {
    uid: user.uid,          // 🔥 Required for Firestore security rules
    date,
    type,
    category,
    amount,
    method,
    description,
    createdAt: Date.now()   // Timestamp
  };

  console.log("📦 Entry to save:", entry);

  try {
    console.log("📤 Sending entry to Firestore...");
    await addEntry(entry);
    console.log("✅ Entry saved successfully!");

    alert("Entry saved successfully!");

    // Reset some fields
    amountInput.value = "";
    methodInput.value = "";
    descriptionInput.value = "";

  } catch (err) {
    console.error("❌ Firestore save error:", err);
    alert("Failed to save entry. Check console.");
  }
});
