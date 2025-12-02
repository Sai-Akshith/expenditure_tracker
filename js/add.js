document.getElementById("entry-form").addEventListener("submit", function(e) {
  e.preventDefault();

  let data = loadEntries();

  const entry = {
    id: Date.now(),
    date: date.value,
    type: type.value,
    category: category.value,
    amount: parseFloat(amount.value),
    description: description.value
  };

  data.push(entry);
  saveEntries(data);

  alert("Entry added!");
  this.reset();
});