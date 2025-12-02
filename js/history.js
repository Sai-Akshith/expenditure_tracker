// js/history.js
const bodyEl = document.getElementById("history-body");
const emptyMsg = document.getElementById("empty-msg");

let entries = loadEntries();

// Sort entries (newest first)
entries.sort((a, b) => {
  if (a.date === b.date) return b.createdAt - a.createdAt;
  return b.date.localeCompare(a.date);
});

if (!entries.length) {
  emptyMsg.style.display = "block";
} else {
  emptyMsg.style.display = "none";
}

function render() {
  bodyEl.innerHTML = "";

  entries.forEach((e) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${e.date}</td>
      <td>${e.type}</td>
      <td>${e.category}</td>
      <td>${format(e.amount)}</td>
      <td>${e.method || "-"}</td>
      <td>${e.description || "-"}</td>

      <td>
        <button class="edit-btn" onclick="editEntry(${e.id})">Edit</button>
        <button class="delete-btn" onclick="deleteEntry(${e.id})">Delete</button>
      </td>
    `;

    bodyEl.appendChild(tr);
  });
}

render();

// DELETE FUNCTION
window.deleteEntry = function(id) {
  const ok = confirm("Delete this entry?");
  if (!ok) return;

  entries = entries.filter(e => e.id !== id);
  saveEntries(entries);
  render();
};

// EDIT FUNCTION
window.editEntry = function(id) {
  const item = entries.find(e => e.id === id);
  if (!item) return;

  const newAmount = prompt("Enter new amount:", item.amount);
  if (newAmount === null) return;

  const parsed = parseFloat(newAmount);
  if (isNaN(parsed) || parsed <= 0) {
    alert("Invalid amount");
    return;
  }

  item.amount = parsed;
  saveEntries(entries);
  render();
};
