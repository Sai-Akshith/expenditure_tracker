// js/add.js
console.log("add.js loaded successfully");

const form = document.getElementById("entry-form");
const dateInput = document.getElementById("date");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const methodInput = document.getElementById("method");
const descriptionInput = document.getElementById("description");

// default date = today
if (!dateInput.value) {
  dateInput.valueAsDate = new Date();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("🚀 FORM SUBMITTED");

  const date = dateInput.value;
  const type = typeInput.value;
  const category = categoryInput.value;
  const amount = parseFloat(amountInput.value);
  const method = methodInput.value.trim();
  const description = descriptionInput.value.trim();

  console.log("Collected values:", { date, type, category, amount, method, description });

  try {
    console.log("Calling addEntry...");
    await addEntry({ date, type, category, amount, method, description });
    console.log("🔥 addEntry finished");
  } catch (err) {
    console.error("❌ Firestore error:", err);
  }
});
