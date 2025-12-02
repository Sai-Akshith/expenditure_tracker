// js/add.js
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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const date = dateInput.value;
  const type = typeInput.value;
  const category = categoryInput.value;
  const amount = parseFloat(amountInput.value);
  const method = methodInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!date || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid date and amount.");
    return;
  }

  const entries = loadEntries();

  entries.push({
    id: Date.now(),
    date,
    type,
    category,
    amount,
    method,
    description,
    createdAt: Date.now()
  });

  saveEntries(entries);

  alert("Entry saved");

  // reset form (keep date same)
  amountInput.value = "";
  methodInput.value = "";
  descriptionInput.value = "";
});
