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

  try {
    await addEntry({
      date,
      type,
      category,
      amount,
      method,
      description
    });

    alert("Entry saved ✅");

    // reset fields (keep date)
    amountInput.value = "";
    methodInput.value = "";
    descriptionInput.value = "";
  } catch (err) {
    console.error(err);
    alert("Failed to save entry. Check console.");
  }
});

